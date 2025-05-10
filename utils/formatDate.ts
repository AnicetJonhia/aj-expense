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



function extractDateParts(dateString: string): { year: number; month?: number; day?: number } {
    const parts = dateString.split('-').map(part => parseInt(part, 10));
  
    const [year, month, day] = parts;
  
    return {
      year,
      ...(month && { month }),
      ...(day && { day }),
    };
  }


export {formatDate,extractDateParts};