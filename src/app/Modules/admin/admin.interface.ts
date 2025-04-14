/* eslint-disable @typescript-eslint/no-explicit-any */

  export type TCategory = {
    category_name: string;
    subCategories: {
      [x: string]: any;
      categoryImage : string;
      subCategory : string
    }[];
  }
  