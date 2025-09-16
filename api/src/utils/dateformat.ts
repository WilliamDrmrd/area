export function formatDate(date: Date, hour: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(date.getDate() + 1).padStart(2, '0');
  let hours: string = hour.toString();
  hours = hours.length === 1 ? `0${hours}` : hours;
  const minutes = '00';
  const seconds = '00';

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
