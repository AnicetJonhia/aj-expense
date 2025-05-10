function formatDate(dateString: string) {
    const parts = dateString.split('-');
    const year = parts[0];
    const monthIndex = parts[1] ? parseInt(parts[1], 10) - 1 : null;
    const day = parts[2] ? parseInt(parts[2], 10) : null;
  
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    if (monthIndex === null) {
      return `${year}`;
    }
  
    const month = months[monthIndex];
  
    if (!day) {
      return `${month}, ${year}`;
    }
  
  
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
  
    return `${month} ${day}${suffix}, ${year}`;
  }


  function extractDateParts(dateStr: string): {
    year?: number;
    month?: number;
    day?: number;
  } {
    const parts = dateStr.split('-');
    const year = parts[0] ? Number(parts[0]) : undefined;
    const month = parts[1] ? Number(parts[1]) - 1 : undefined; // JS month starts from 0
    const day = parts[2] ? Number(parts[2]) : undefined;
  
    return { year, month, day };
  }




export {formatDate,extractDateParts};