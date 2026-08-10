"""Pure helper functions for stats & CSV export — testable in isolation."""
import calendar
import io
import csv
from datetime import datetime, timezone
from typing import Iterable, List, Tuple


def parse_month(month: str) -> Tuple[int, int, datetime, datetime, int]:
    """Parse 'YYYY-MM' into (year, month, start, end, last_day). Raises ValueError."""
    y, m = month.split("-")
    y, m = int(y), int(m)
    last_day = calendar.monthrange(y, m)[1]
    start = datetime(y, m, 1, tzinfo=timezone.utc)
    end = datetime(y, m, last_day, 23, 59, 59, tzinfo=timezone.utc)
    return y, m, start, end, last_day


def current_month_str(now: datetime | None = None) -> str:
    n = now or datetime.now(timezone.utc)
    return f"{n.year:04d}-{n.month:02d}"


def _extract_day(created) -> int | None:
    """Return the day-of-month for a Mongo created_at value, or None if unparseable."""
    if hasattr(created, "day"):
        return created.day
    try:
        return datetime.fromisoformat(str(created)).day
    except Exception:
        return None


def bucket_orders_by_day(orders: Iterable[dict], last_day: int) -> dict:
    """Group orders per day-of-month. Cancelled orders count but don't add revenue."""
    buckets = {d: {"count": 0, "revenue": 0} for d in range(1, last_day + 1)}
    for o in orders:
        day = _extract_day(o.get("created_at"))
        if not day or day not in buckets:
            continue
        buckets[day]["count"] += 1
        if o.get("status") != "cancelled":
            buckets[day]["revenue"] += int(o.get("total") or 0)
    return buckets


def buckets_to_days(buckets: dict, y: int, m: int, last_day: int) -> List[dict]:
    """Flatten bucket dict into a sorted list of {date, count, revenue}."""
    return [
        {
            "date": f"{y:04d}-{m:02d}-{d:02d}",
            "count": buckets[d]["count"],
            "revenue": buckets[d]["revenue"],
        }
        for d in range(1, last_day + 1)
    ]


# ---------- CSV EXPORT ----------
CSV_HEADER = [
    "ID", "Waktu", "Status", "Nama Pelanggan", "No. HP",
    "Zona Pengiriman", "Ongkir", "Subtotal", "Total",
    "Admin WA", "Item (nama x qty)", "Catatan",
]


def _format_items(items: list) -> str:
    return " | ".join(
        f"{it.get('name')}{(' - ' + it.get('variant')) if it.get('variant') else ''} x {it.get('qty')}kg"
        for it in (items or [])
    )


def _format_time(created) -> str:
    if hasattr(created, "isoformat"):
        return created.isoformat()
    return str(created or "")


def order_to_csv_row(order: dict) -> list:
    """Convert one order dict into CSV row list matching CSV_HEADER."""
    return [
        order.get("id", ""),
        _format_time(order.get("created_at")),
        order.get("status", ""),
        order.get("customer_name", ""),
        order.get("customer_phone", ""),
        order.get("zone_name", ""),
        order.get("shipping_cost", 0),
        order.get("subtotal", 0),
        order.get("total", 0),
        order.get("admin_name") or order.get("admin_phone", ""),
        _format_items(order.get("items")),
        order.get("customer_note", ""),
    ]


def orders_to_csv_bytes(orders: Iterable[dict]) -> bytes:
    """Serialize orders to UTF-8 CSV bytes with BOM (Excel-friendly)."""
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(CSV_HEADER)
    for o in orders:
        w.writerow(order_to_csv_row(o))
    return ("\ufeff" + buf.getvalue()).encode("utf-8")
