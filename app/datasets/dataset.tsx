export interface SalesRecord {
  model: string;
  year: number;
  monthly: number[];
  sumOfSales: number;
  category: string;
}

export const salesData: SalesRecord[] = [
  {
    model: "Acura MDX", year: 2021,
    monthly: [93,389,782,611,550,501,0,0,0,0,0,0],
    sumOfSales: 2926, category: "MLS"
  },
  {
    model: "Audi Q7", year: 2021,
    monthly: [210,210,236,303,292,303,0,0,0,0,0,0],
    sumOfSales: 1554, category: "MLS"
  },
  {
    model: "Audi Q8", year: 2021,
    monthly: [130,130,146,211,203,211,0,0,0,0,0,0],
    sumOfSales: 1031, category: "MLS"
  },
  {
    model: "BMW X5", year: 2021,
    monthly: [323,323,364,518,498,518,0,0,0,0,0,0],
    sumOfSales: 2544, category: "MLS"
  },
  {
    model: "BMW X6", year: 2021,
    monthly: [72,72,81,113,108,113,0,0,0,0,0,0],
    sumOfSales: 559, category: "MLS"
  },
  {
    model: "Cadillac XT5", year: 2021,
    monthly: [378,378,425,575,553,575,0,0,0,0,0,0],
    sumOfSales: 2884, category: "MLS"
  },
  {
    model: "Cadillac XT6", year: 2021,
    monthly: [146,146,164,175,168,175,0,0,0,0,0,0],
    sumOfSales: 974, category: "MLS"
  },
  {
    model: "Genesis GV80", year: 2021,
    monthly: [108,106,160,154,146,168,121,0,0,0,0,0,0],
    sumOfSales: 963, category: "MLS"
  },
  {
    model: "Infiniti QX60", year: 2021,
    monthly: [130,130,146,95,91,95,0,0,0,0,0,0],
    sumOfSales: 687, category: "MLS"
  },
  {
    model: "Jaguar F0Pace", year: 2021,
    monthly: [116,116,131,184,177,184,0,0,0,0,0,0],
    sumOfSales: 908, category: "MLS"
  },
  // … (continue in the same pattern)
  {
    model: "Acura MDX", year: 2020,
    monthly: [194,196,94,54,224,420,353,420,437,429,255,845],
    sumOfSales: 3921, category: "MLS"
  },
  {
    model: "Audi Q7", year: 2020,
    monthly: [142,183,111,81,181,190,266,236,256,203,167,232],
    sumOfSales: 2248, category: "MLS"
  },
  
];

