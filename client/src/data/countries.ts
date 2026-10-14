export interface Country {
    name: string;
    code: string;
    prefix: string;
    flag: string;
  }
  
  export const COUNTRIES: Country[] = [
    { name: "United States", code: "US", prefix: "+1", flag: "🇺🇸" },
    { name: "India", code: "IN", prefix: "+91", flag: "🇮🇳" },
    { name: "United Kingdom", code: "GB", prefix: "+44", flag: "🇬🇧" },
    { name: "Canada", code: "CA", prefix: "+1", flag: "🇨🇦" },
    { name: "Germany", code: "DE", prefix: "+49", flag: "🇩🇪" },
    { name: "France", code: "FR", prefix: "+33", flag: "🇫🇷" },
    { name: "Australia", code: "AU", prefix: "+61", flag: "🇦🇺" },
    { name: "Brazil", code: "BR", prefix: "+55", flag: "🇧🇷" },
    { name: "Japan", code: "JP", prefix: "+81", flag: "🇯🇵" },
    { name: "Nigeria", code: "NG", prefix: "+234", flag: "🇳🇬" },
    { name: "United Arab Emirates", code: "AE", prefix: "+971", flag: "🇦🇪" },
  ];