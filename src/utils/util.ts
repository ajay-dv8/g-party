
import { formatDistanceToNow } from 'date-fns';

// Helper functions
export const formatTimeElapsed = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const distance = formatDistanceToNow(date, { addSuffix: false });
      
      // Convert to shorthand format
      return distance
        .replace(' seconds', 's')
        .replace(' second', 's')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' days', 'd')
        .replace(' day', 'd')
        .replace(' weeks', 'w')
        .replace(' week', 'w')
        .replace(' months', 'mo')
        .replace(' month', 'mo')
        .replace(' years', 'y')
        .replace(' year', 'y')
        .replace('about ', '')
        .replace('less than ', 'Just now');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "unknown";
    }
  };
  
  export const formatCount = (count: number): string => {
    if (count >= 1000000000) {
      return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };
  