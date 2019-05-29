export enum Category {
  Mortgage = 'Mortage',
  CouncilRates = 'Rates',
  Utilities = 'Utilities',
  PhoneTV = 'Phone/TV/Internet',
  Groceries = 'Groceries',
  Health = 'Health',
  FoodEntertainment = 'Food & Entertainment',
  ChildCare = 'Child Care',
  School = 'School/Tuition',
  ClothingBooksGifts = 'Clothing/Books/Gifts',
  Transport = 'Transport',
  Insurance = 'Insurance',
  Charity = 'Charity',
  Other = 'Other',
  Ignore = 'Ignore',
}

export class Categoriser {
  narrationMap: any = {
    'PLINE PH JOONDALUP631    JOONDALUP': 'Priceline Pharmacy',
    'WEST LEEDERVILLE         WEST LEEDERVIWA': 'Hylin',
  };

  categorise(row: any, filter: string, category: Category, subcategory: string) {
    if (!row.Narration || row.Category) return;

    if (new RegExp(filter).test(row.Narration) || new RegExp(filter).test(this.narrationMap[row.Narration])) {
      row.Category = category.toString();
      row.SubCategory = subcategory;
    }
  }

  categoriseAll(row: any) {
    row.Narration = row.Narration && row.Narration.replace('AUTHORISATION ONLY - ', '');
    this.categorise(
      row,
      '.*(CHEMIST|Diagnostic|(H|h)ospital|paed|Radiology|PLINE|PHARMACY|MASSAGE|HEALTH|PHYSIO|Obgyn|PHILIP ROWLANDS|TERRY WHITE|WALGREENS|ARMANDO CHIERA|JASON KIELY|FOOT HAVEN).*',
      Category.Health,
      'Medical',
    );
    this.categorise(
      row,
      '.*(KMART|RED DOT|BUNNINGS|BEST & LESS|HOME|TARGET|BIG W).*',
      Category.ClothingBooksGifts,
      'House',
    );
    this.categorise(
      row,
      '.*(Amazon Go|SPUDSHED|COLES|WOOLWORTHS|ALDI|IGA|BAKERY|MR FRESH|VEEOS|FRESH|Fresh|ORIENTAL).*',
      Category.Groceries,
      'Groceries',
    );
    this.categorise(
      row,
      '.*(RAW N REAL|PAYSTAY|GAME CITY|ESPRESSO|Hylin|MAGDIEL|Filter & Fare|CAFE|Caffe|DELAWARE NORTH|Muzz Buzz|MAX AND SONS|LOWDOWN|ALH GROUP|UMA VIDA|YELO|KRUSTYKOB|COFFEE|HOLMES AND CO|96 Express|Holiday Inn City Centr|Coffee|GHIASSI|UTOPIA|Voodoo).*',
      Category.FoodEntertainment,
      'Coffee',
    );
    this.categorise(
      row,
      '.*(BEEM IT|GANPING LIN|HJ |BENANDJERRY|HOLEY MOLEY|MASS/INJ|INDIAN|HISS & SMOKE|Isle Of Voyage|THAI|MAD MEX|KFC|UNCLE JOES|DOMINOS|BBQ|SATAY|ZAMBRERO|CHIMEK|TOKYO STATION|LEEDERVILLE FOODS|DJ COMBINE|COLD ROCK|Jesters Pies|GREEKFELLAS|iL Tavolo Rustico|VASHNAV|CHINESE|ZHONG LIANG|GHIRARDELLI|Menulog|BOUDIN|KEBAB|BOOST JUICE|SHY JOHN|GRILLD|SUBWAY|GREENHORNS|SUN KWONG|SUNNYSIDE UP|JAPANESE|SUSHI|FRO YO|MCDONALDS|PHETCHABURA|HAWELI|WILD FIG|MEET AND BUN|KITCHEN|Tim Ho Wan|BURGER).*',
      Category.FoodEntertainment,
      'Take-out',
    );
    this.categorise(row, '.*(REBEL|HBF RUN|SPORTS|GOOD LIFE|Hockey|Umpiring).*', Category.Health, 'Sport');
    this.categorise(row, '.*(HAIR|BARBER|NAILS|Threading).*', Category.Other, 'Hair/Makeup');
    this.categorise(row, '.*(Clean|rob stoltze).*', Category.Other, 'House');
    this.categorise(row, '.*(ATM).*', Category.Other, 'Cash');
    this.categorise(
      row,
      '.*(LIQUOR|DAN MURPHYS|STREET EATS|BEAUMONDE|BANKWEST FOUNDATION).*',
      Category.FoodEntertainment,
      'Alcohol',
    );
    this.categorise(row, '.*(INSURANCE).*', Category.Insurance, 'Insurance');
    this.categorise(row, '.*(NETFLIX).*', Category.PhoneTV, 'TV');
    this.categorise(row, '.*(POST).*', Category.ClothingBooksGifts, 'Office');
    this.categorise(row, '.*(BIRTHS DEATHS).*', Category.ClothingBooksGifts, 'Office');
    this.categorise(row, '.*(BOOKS|AMAZON MKTPLC|BOOKDEPO|TREASA).*', Category.ClothingBooksGifts, 'Books');
    this.categorise(row, '.*(GFP BABIES).*', Category.Other, 'Photos');
    this.categorise(row, '.*(EBAY).*', Category.Other, 'eBay');
    this.categorise(row, '.*(TELSTRA|OPTUS|AT&T).*', Category.PhoneTV, 'Mobile');
    this.categorise(row, '.*(LATITUDE|PROUDS|ETSY).*', Category.ClothingBooksGifts, 'Jewellery');
    this.categorise(
      row,
      '.*(MYER|RIVERS|SHOEMEN|WITCHERY|SUSSAN|MILLERS|WATERTOWN).*',
      Category.ClothingBooksGifts,
      'Clothing',
    );
    this.categorise(row, '.*(Vehicle).*', Category.Transport, 'Car');
    this.categorise(row, '.*(CALTEX).*', Category.Transport, 'Fuel');
    this.categorise(row, '.*(UBER).*', Category.Transport, 'Ridesharing');
    this.categorise(row, '.*(TRANSPERTH|SMARTRIDER).*', Category.Transport, 'Public Transport');
    this.categorise(row, '.*(Broadband|BROADBAND|IINET).*', Category.PhoneTV, 'Internet');
    this.categorise(row, '.*(PARK|CPP).*', Category.Transport, 'Parking');
    this.categorise(row, '.*(Vet|VET|PET).*', Category.Health, 'Pet');
    this.categorise(row, '.*(SYNERGY).*', Category.Utilities, 'Utilities');
    this.categorise(row, '.*(HYATT|OAKLAND|SAN FRANCISCO|AIRPORT|SAUSALITO).*', Category.Other, 'Travel');
    this.categorise(row, '.*(OPEN DOOR).*', Category.Charity, 'Charity');

    this.categorise(row, '.*(ENTERTAINMENT|Golden State Warriors).*', Category.FoodEntertainment, 'Entertainment');

    this.categorise(row, '.*(COMPLETE FIXED HL|COMPLETE VARIABLE HL).*', Category.Mortgage, 'Mortgage Repayments');

    this.categorise(row, '.*(PERIODICAL PAYMENT TO MASTERCARD|IB TRANSFER).*', Category.Ignore, 'Ignore');

    this.categorise(row, '.*(SQ *).*', Category.FoodEntertainment, 'Food');
    this.categorise(row, '.*(PAYPAL|Groupon).*', Category.Other, 'Online Shopping');
  }
}
