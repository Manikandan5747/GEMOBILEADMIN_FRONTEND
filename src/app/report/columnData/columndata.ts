export const ACTIVE_CARS_DETAILS_COLUMNS = [
  { columnName: "BRAND", fieldName: "brandname", label: 'Brandname', type: 'text', tableName: "app_brand", },
  { columnName: "MODEL", fieldName: "modelname", label: 'Modelname', type: 'text', tableName: "app_model", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails", },
  { columnName: "CHASIS NO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "SELLER NAME", fieldName: "sellername", label: 'Chasis No', type: 'text', tableName: "app_account" },

  { columnName: "TOTAL EXPENSE", fieldName: "totalexpense", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "SELLING PRICE", fieldName: "carprice", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },


  { columnName: "MODEL YEAR", fieldName: "modelyear", label: 'Modelyear', type: 'text', tableName: "app_cardetails", },
  // { columnName: "MILEAGE", fieldName: "mileage", label: 'Mileage', type: 'text', tableName: "app_cardetails", },
  // { columnName: "DRIVE TYPE", fieldName: "drivetype", label: 'Drivetype', type: 'text', tableName: "app_cardetails", },
  // { columnName: "NO OF CYLINDER", fieldName: "noofcylinder", label: 'Noofcylinder', type: 'text', tableName: "app_cardetails", },


  { columnName: "PURCHASE PRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE DATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails", },
  { columnName: "HOLDING PERIOD", fieldName: "holdingperiod", label: 'Holding Period', type: 'text', tableName: "app_cardetails", },
  // { columnName: "SHELF LIFE", fieldName: "shelflife", label: 'Shelf Life', type: 'text', tableName: "app_cardetails", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_cardetails",
  },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails", },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },

];

export const CONSIGNMENT_CARS_DETAILS_COLUMNS = [
  { columnName: "CONSIGNMENT REF NO", fieldName: "consignmentrefno", label: 'Consignment Ref No', type: 'text', tableName: "app_consignmentdettb" },
  { columnName: "SIGNATURE STATUS", fieldName: "signature_status", label: 'Signature Status', type: 'text', tableName: "app_crmdigitalsignaturedetails" },
    { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },
   { columnName: "CONSIGNMENT AMOUNT", fieldName: "consignmentamount", label: 'Consignment Amount', type: 'text', tableName: "app_consignmentdettb" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brandname', type: 'text', tableName: "app_brand", },
  { columnName: "MODEL", fieldName: "modelname", label: 'Modelname', type: 'text', tableName: "app_model", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails", },
  { columnName: "CHASIS NO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "SELLER NAME", fieldName: "sellername", label: 'Chasis No', type: 'text', tableName: "app_account" },
  { columnName: "SELLING PRICE", fieldName: "carprice", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "MODEL YEAR", fieldName: "modelyear", label: 'Modelyear', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE PRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE DATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_cardetails",
  },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails", },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },

];

export const PURCHASEAGGREMENTCARSDETAILSREPORT = [
  { columnName: "PURCHASE AGREEMENT REF NO", fieldName: "purchaseagreementrefno", label: 'Purchase Agreement Ref No', type: 'text', tableName: "app_consignmentdettb" },
  { columnName: "SIGNATURE STATUS", fieldName: "signature_status", label: 'Signature Status', type: 'text', tableName: "app_crmdigitalsignaturedetails" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brandname', type: 'text', tableName: "app_brand", },
  { columnName: "MODEL", fieldName: "modelname", label: 'Modelname', type: 'text', tableName: "app_model", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails", },
  { columnName: "CHASIS NO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "SELLER NAME", fieldName: "sellername", label: 'Chasis No', type: 'text', tableName: "app_account" },
  { columnName: "SELLING PRICE", fieldName: "carprice", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "MODEL YEAR", fieldName: "modelyear", label: 'Modelyear', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE PRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE DATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_cardetails",
  },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails", },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },

];

export const CASHREQUESTCARSDETAILSREPORT = [
  { columnName: "CASH REQUEST REFNO", fieldName: "cashrequesrefno", label: 'Ref No', type: 'text', tableName: "app_carownertype", },
    { columnName: "CASH REQUEST TYPE", fieldName: "cashrequesttype", label: 'CASH REQUEST TYPE', type: 'text', tableName: "app_cashrequest" },
   { columnName: "MODE OF PAYMENT", fieldName: "modeofpayment", label: 'MODE OF PAYMENT', type: 'text', tableName: "app_cashrequest" }, 
    { columnName: "REQUEST DATE", fieldName: "requestdate", label: 'REQUEST DATE', type: 'date', tableName: "app_cashrequest" },
  { columnName: "AMOUNT", fieldName: "amount", label: 'AMOUNT', type: 'text', tableName: "app_cashrequest" },     
   { columnName: "PAYMENT STATUS", fieldName: "paymentstatus", label: 'PAYMENT STATUS', type: 'text', tableName: "app_cashrequest" },  
  { columnName: "BRAND", fieldName: "brandname", label: 'Brandname', type: 'text', tableName: "app_brand", },
  { columnName: "MODEL", fieldName: "modelname", label: 'Modelname', type: 'text', tableName: "app_model", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails", },
  { columnName: "CHASIS NO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "SELLER NAME", fieldName: "sellername", label: 'Chasis No', type: 'text', tableName: "app_account" },
  { columnName: "SELLING PRICE", fieldName: "carprice", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "MODEL YEAR", fieldName: "modelyear", label: 'Modelyear', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE PRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE DATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_cardetails",
  },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails", },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },

];

export const SOLD_CAR_DETAIL_COLUMNS: any[] = [];

export const ADVANCE_DETAIL_COLUMNS = [
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model", },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails", },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "ADVANCE REF NO", fieldName: "advancerefno", label: 'Advance Ref No', type: 'text', tableName: "app_advancedettb", },
  { columnName: "DUE DATE", fieldName: "duedate", label: 'Due Date', type: 'date', tableName: "app_advancedettb", },
  { columnName: "ADVANCE AMOUNT", fieldName: "advanceamount", label: 'Advance Amount', type: 'text', tableName: "app_advancedettb", },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },

   { columnName: "NARRATION NOTE", fieldName: "narrationnote", label: 'Narration Note', type: 'text', tableName: "app_advancedettb", },
  

  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_advancedettb",
  },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_advancedettb", },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", }
];

export const BRAND_WISE_CAR_DETAILS_COLUMNS = [
  { columnName: "BRAND", fieldName: "brandname", label: 'Brandname', type: 'text', tableName: "app_brand", },
  { columnName: "MODEL", fieldName: "modelname", label: 'Modelname', type: 'text', tableName: "app_model", },
  { columnName: "MODELYEAR", fieldName: "modelyear", label: 'Modelyear', type: 'text', tableName: "app_cardetails", },
  { columnName: "MILEAGE", fieldName: "mileage", label: 'Mileage', type: 'text', tableName: "app_cardetails", },
  { columnName: "DRIVE TYPE", fieldName: "drivetype", label: 'Drivetype', type: 'text', tableName: "app_cardetails", },
  { columnName: "NOOFCYLINDER", fieldName: "noofcylinder", label: 'Noofcylinder', type: 'text', tableName: "app_cardetails", },
  { columnName: "CAR PRICE", fieldName: "carprice", label: 'Carprice', type: 'text', tableName: "app_cardetails", },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "PURCHASE PRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails", },
  { columnName: "PURCHASE DATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails", },
  // { columnName: "SELLING PRICE", fieldName: "sellingprice", label: 'Selling Price', type: 'text', tableName: "app_cardetails", },
  // { columnName: "SELLING DATE", fieldName: "sellingdate", label: 'Selling Date', type: 'date', tableName: "app_cardetails", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_cardetails",
  },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Createdbyname', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails", }
];

export const LEAD_DETAIL_COLUMNS = [

  { columnName: "ACCOUNT CATEGORY TYPE", fieldName: "leadtype", label: 'Account Category Type', type: 'text', tableName: "app_leads", },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_leads", },
  { columnName: "FIRST NAME", fieldName: "firstname", label: 'First Name', type: 'text', tableName: "app_leads", },
  { columnName: "LAST NAME", fieldName: "lastname", label: 'Last Name', type: 'text', tableName: "app_leads", },
  { columnName: "MOBILE", fieldName: "mobile", label: 'Mobile', type: 'text', tableName: "app_leads", },
  { columnName: "LEAD SOURCE ", fieldName: "leadsourcename", label: 'Lead Source Name', type: 'text', tableName: "app_leadsourceconfig", },
  { columnName: "LEAD RATING ", fieldName: "leadsratingname", label: 'Lead Rating Name', type: 'text', tableName: "app_leadsratingconfig", },
  { columnName: "CAMPAIGN ", fieldName: "name", label: 'Campaign Name', type: 'text', tableName: "app_campaigns", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_leads",
  },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_leads", }
];

export const OPPORTUNITY_DETAIL_COLUMNS = [
  { columnName: "OPPORTUNITY REF NO", fieldName: "opportunityrefno", label: 'Opportunity Ref No', type: 'text', tableName: "app_opportunity ", },
  { columnName: "OPPORTUNITY", fieldName: "opportunityname", label: 'Opportunity Name', type: 'text', tableName: "app_opportunity", },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },
  { columnName: "CONTACT ", fieldName: "contactfirstname", label: 'Contact First Name', type: 'text', tableName: "app_contact", },
  { columnName: "CAMPAIGN", fieldName: "name", label: 'Campaign', type: 'text', tableName: "app_campaigns", },
  { columnName: "OPPORTUNITY TYPE", fieldName: "typename", label: 'Opportunity Type', type: 'text', tableName: "app_opportunitytypeconfig", },
  { columnName: "LEAD SOURCE", fieldName: "leadsourcename", label: 'Lead Source', type: 'text', tableName: "app_leads", },
  { columnName: "STAGE", fieldName: "stagename", label: 'Stage', type: 'text', tableName: "app_stage", },
  { columnName: "STAGE PROBABILITY", fieldName: "stageprobability", label: 'Stage Probability', type: 'text', tableName: "app_opportunity", },
  { columnName: "DEAL STATUS", fieldName: "dealstatusname", label: 'Deal Status', type: 'text', tableName: "app_opportunity", },
  { columnName: "EXPECTED CLOSE DATE", fieldName: "expectedclosedate", label: 'Expected Close Date', type: 'date', tableName: "app_opportunity", },
  { columnName: "TOTAL AMOUNT", fieldName: "amount", label: 'Total Amount', type: 'text', tableName: "app_opportunity", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_opportunity",
  },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_opportunity", },
  { columnName: "MODIFIED BY", fieldName: "updatedbyname", label: 'Modified By', type: 'text', tableName: "app_userlogin", },
  { columnName: "MODIFIED AT", fieldName: "modifiedat", label: 'Modified At', type: 'date', tableName: "app_opportunity", }
];

export const OPPORTUNITY_CAR_DETAILS_COLUMNS = [
  { columnName: "OPPORTUNITY REF NO", fieldName: "opportunityrefno", label: 'Opportunity Ref No', type: 'text', tableName: "app_opportunity", },
  { columnName: "OPPORTUNITY", fieldName: "opportunityname", label: 'Opportunity Name', type: 'text', tableName: "app_opportunity", },
  { columnName: "QUANTITY", fieldName: "quantity", label: 'Quantity', type: 'text', tableName: "app_opportunitydettb", },
  { columnName: "SALES PRICE", fieldName: "salesprice", label: 'Sales Price', type: 'text', tableName: "app_opportunitydettb", },
  { columnName: "AMOUNT", fieldName: "amount", label: 'Amount', type: 'text', tableName: "app_opportunitydettb", },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand", },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model", },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails", },
  { columnName: "LEAD SOURCE ", fieldName: "leadsourcename", label: 'Lead Source Name', type: 'text', tableName: "app_leadsourceconfig", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_opportunitydettb",
  },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_opportunitydettb", }
];

export const QUOTATION_DETAIL_COLUMNS = [
  { columnName: "QUOTE REF NO", fieldName: "quoterefno", label: 'Quote Ref No', type: 'text', tableName: "app_quote", },
  { columnName: "QUOTE", fieldName: "quotename", label: 'Quote Name', type: 'text', tableName: "app_quote", },
  { columnName: "OPPORTUNITY", fieldName: "opportunityname", label: 'Opportunity Name', type: 'text', tableName: "app_opportunity", },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },
  { columnName: "EXPIRY DATE", fieldName: "expirydate", label: 'Expiry Date', type: 'date', tableName: "app_quote", },
  { columnName: "EXCHANGE RATE", fieldName: "exchangerate", label: 'Exchange Rate', type: 'text', tableName: "app_quote", },
  // { columnName: "DESCRIPTION", fieldName: "description", label: 'Description', type: 'text', tableName: "app_quote", },
  { columnName: "SUBTOTAL", fieldName: "subtotal", label: 'Subtotal', type: 'text', tableName: "app_quote", },
  { columnName: "DISCOUNT", fieldName: "discount", label: 'Discount', type: 'text', tableName: "app_quote", },
  { columnName: "TAX", fieldName: "tax", label: 'Tax', type: 'text', tableName: "app_quote", },
  { columnName: "GRAND TOTAL", fieldName: "grandtotal", label: 'Grand Total', type: 'text', tableName: "app_quote", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_quote"
  },
  { columnName: "CREATED BY ", fieldName: "createdbyname", label: 'Created By Name', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_quote", },
  { columnName: "UPDATED BY ", fieldName: "updatedbyname", label: 'Updated By Name', type: 'text', tableName: "app_userlogin", },
  { columnName: "MODIFIED AT", fieldName: "modifiedat", label: 'Modified At', type: 'date', tableName: "app_quote", },


];

export const QUOTATION_CAR_DETAILS_COLUMNS = [
  { columnName: "QUOTE", fieldName: "quotename", label: 'Quote Name', type: 'text', tableName: "app_quote" },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails", },
  // { columnName: "FIRST NAME", fieldName: "firstname", label: 'First Name', type: 'text', tableName: "app_contact" },
  { columnName: "OPPORTUNITY", fieldName: "opportunityname", label: 'Opportunity Name', type: 'text', tableName: "app_opportunity" },
  { columnName: "EXPIRY DATE", fieldName: "expirydate", label: 'Expiry Date', type: 'date', tableName: "app_quote" },
  { columnName: "SUBTOTAL", fieldName: "subtotal", label: 'Subtotal', type: 'text', tableName: "app_quotationdettb" },
  { columnName: "TAX", fieldName: "tax", label: 'Tax', type: 'text', tableName: "app_quotationdettb" },
  { columnName: "DISCOUNT", fieldName: "discount", label: 'Discount', type: 'text', tableName: "app_quotationdettb" },
  { columnName: "GRAND TOTAL", fieldName: "grandtotal", label: 'Grand Total', type: 'text', tableName: "app_quote" },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_quotationdettb"
  },
  { columnName: "QUANTITY", fieldName: "quantity", label: 'Quantity', type: 'text', tableName: "app_quotationdettb" },
  { columnName: "TAX AMOUNT", fieldName: "taxamount", label: 'Tax Amount', type: 'text', tableName: "app_quotationdettb" },
  { columnName: "SALES PRICE", fieldName: "salesprice", label: 'Sales Price', type: 'text', tableName: "app_quotationdettb" },
  { columnName: "AMOUNT", fieldName: "amount", label: 'Amount', type: 'text', tableName: "app_quotationdettb" },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_quotationdettb" },
  { columnName: "MODIFIED AT", fieldName: "modifiedat", label: 'Modified At', type: 'date', tableName: "app_quotationdettb" },
  { columnName: "CREATED BY ", fieldName: "createdbyname", label: 'Created By Name', type: 'text', tableName: "app_userlogin" },
  { columnName: "UPDATED BY ", fieldName: "updatedbyname", label: 'Updated By Name', type: 'text', tableName: "app_userlogin" }
];

export const SALES_ORDER_DETAIL_COLUMNS: any[] = [
  { columnName: "SALES ORDER REF NO", fieldName: "salesorderrefno", label: 'Sales Order Ref No', type: 'text', tableName: "app_salesorder" },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },
  { columnName: "SALES ORDER ", fieldName: "salesordername", label: 'Sales Order Name', type: 'text', tableName: "app_salesorder" },
  { columnName: "OPPORTUNITY", fieldName: "opportunityname", label: 'Opportunity Name', type: 'text', tableName: "app_opportunity" },
  { columnName: "EXPIRY DATE", fieldName: "expirydate", label: 'Expiry Date', type: 'date', tableName: "app_salesorder" },
  // { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  // { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  // { columnName: "CAR REF NO", fieldName: "carrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  // { columnName: "QUANTITY", fieldName: "quantity", label: 'Quantity', type: 'text', tableName: "app_salesorder" },
  // { columnName: "SALES PRICE", fieldName: "salesprice", label: 'Sales Price', type: 'text', tableName: "app_salesorder" },
  { columnName: "DISCOUNT", fieldName: "discount", label: 'Discount', type: 'text', tableName: "app_salesorder" },
  { columnName: "TAX", fieldName: "tax", label: 'Tax', type: 'text', tableName: "app_salesorder" },
  { columnName: "GRAND TOTAL", fieldName: "grandtotal", label: 'Grand Total', type: 'text', tableName: "app_salesorder" },
  { columnName: "PAYMENT STATUS", fieldName: "paymentstatus", label: 'Payment Status', type: 'text', tableName: "app_salesorder" },

  { columnName: "MODE OF PAYMENT", fieldName: "modeofpayment", label: 'Mode Of Payment', type: 'text', tableName: "app_salesorder" },

  { columnName: "PAYMENT DATE", fieldName: "paymentdate", label: 'Payment Date', type: 'date', tableName: "app_salesorder" },

  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_salesorder"
  },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin" },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_userlogin" }
];

export const SALES_ORDER_CAR_DETAILS_COLUMNS: any[] = [
   { columnName: 'SALES ORDER REF NO', fieldName: 'salesorderrefno', label: 'Sales Order Ref No', type: 'text', tableName: "app_salesorder" },
   { columnName: 'SALES ORDER', fieldName: 'salesordername', label: 'Sales Order Name', type: 'text', tableName: "app_salesorder" },
    { columnName: 'OPPORTUNITYNAME', fieldName: 'opportunityname', label: 'Opportunity Name', type: 'text', tableName: "app_opportunity" },
  { columnName: 'Car Ref No', fieldName: 'carshowroomrefno', label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },

  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },
  { columnName: 'BRAND', fieldName: 'brandname', label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: 'MODEL', fieldName: 'modelname', label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  
  { columnName: "CHASIS NO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "SOLD DATE", fieldName: "solddate", label: 'Sold Date', type: 'date', tableName: "app_cardetails" },
    { columnName: "PURCHASE PRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails" },

     { columnName: "TOTAL ADVANCE AMOUNT", fieldName: "totaladvanceamount", label: 'Total Advance Amount', type: 'text', tableName: "app_advancedettb" },
      { columnName: "TOTAL EXPENSE VALUE", fieldName: "totalexpensevalue", label: 'Total Expense Value', type: 'text', tableName: "app_expensedettb" },
    
    
  { columnName: 'SALES AMOUNT', fieldName: 'grandtotal', label: 'Sales Amount', type: 'text', tableName: "app_salesorder" },
 
 
  // {
  //   columnName: 'STATUS', fieldName: 'status', label: 'Status', type: 'select', options: [
  //     { label: 'Active', value: 1 },
  //     { label: 'Inactive', value: 0 }
  //   ], tableName: "app_salesorder"
  // },
  { columnName: 'CREATED BY', fieldName: 'createdbyname', label: 'Created By Name', type: 'text', tableName: "app_userlogin" },
  { columnName: 'CREATEDAT', fieldName: 'createdat', label: 'Created At', type: 'text', tableName: "app_salesorder" },
  { columnName: 'UPDATEDBYNAME', fieldName: 'updatedbyname', label: 'Updated By Name', type: 'text', tableName: "app_userlogin" },
  { columnName: 'MODIFIEDAT', fieldName: 'modifiedat', label: 'Modified At', type: 'text', tableName: "app_salesorder" },



];

export const EXPENSE_DETAIL_COLUMNS: any[] = [
  { columnName: "EXPENSE REF NO", fieldName: "expenserefno", label: 'Expense Ref No', type: 'text', tableName: "app_expensedettb" },
  { columnName: "EXPENSE DATE", fieldName: "expensedate", label: 'Expense Date', type: 'date', tableName: "app_expensedettb" },
  { columnName: "EXPENSE VALUE", fieldName: "expensevalue", label: 'Expense Value', type: 'text', tableName: "app_expensedettb" },
  { columnName: "EXPENSE TYPE", fieldName: "expensetype", label: 'Expense Type', type: 'text', tableName: "app_expensetype" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_expensedettb"
  },
  
   { columnName: "REMARK", fieldName: "remark", label: 'Remark', type: 'text', tableName: "app_expensedettb" },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin" },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_expensedettb" },
  { columnName: "MODIFIED BY", fieldName: "updatedbyname", label: 'Modified By', type: 'text', tableName: "app_userlogin" },
  { columnName: "MODIFIED AT", fieldName: "modifiedat", label: 'Modified At', type: 'date', tableName: "app_expensedettb" }
];

export const CONSIGNMENT_DETAIL_COLUMNS: any[] = [
  { columnName: "CONSIGNMENT REF NO", fieldName: "consignmentrefno", label: 'Consignment Ref No', type: 'text', tableName: "app_consignmentdettb" },
  { columnName: "CONSIGNMENT AMOUNT", fieldName: "consignmentamount", label: 'Consignment Amount', type: 'text', tableName: "app_consignmentdettb" },
  { columnName: "CONSIGNMENT START DATE", fieldName: "consignmentstartdate", label: 'Consignment Start Date', type: 'date', tableName: "app_consignmentdettb" },

  { columnName: "CONSIGNMENT EXPIRY DATE", fieldName: "consignmentexpirydate", label: 'Consignment Expiry Date', type: 'date', tableName: "app_consignmentdettb" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account" },
  { columnName: "CONTACT ", fieldName: "contactname", label: 'Contact Name', type: 'text', tableName: "app_contact" },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_consignmentdettb"
  },

  {
    columnName: "CAR STATUS", fieldName: "showroomcarstatus", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_cardetails"
  },

  { columnName: "INSTOCK", fieldName: "instock", label: 'In Stock', type: 'text', tableName: "app_cardetails" },


  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin" },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_consignmentdettb" },
  { columnName: "MODIFIED BY", fieldName: "updatedbyname", label: 'Modified By', type: 'text', tableName: "app_userlogin" },
  { columnName: "MODIFIED AT", fieldName: "modifiedat", label: 'Modified At', type: 'date', tableName: "app_consignmentdettb" }
];

export const MOBILEADMIN_CAR_DETAIL_COLUMNS: any[] = [
  { columnName: "Car Ref No", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  // { columnName: "SHOWROOM ", fieldName: "showroomname", label: 'Showroom Name', type: 'text',tableName:"app_showroomdetails" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  // { columnName: "CAR VIDEO PATH", fieldName: "carvideopath", label: 'Car Video Path', type: 'text',tableName:"app_cardetails" },
  { columnName: "MODEL YEAR", fieldName: "modelyear", label: 'Model Year', type: 'text', tableName: "app_cardetails" },
  { columnName: "ENGINE CAPACITY", fieldName: "enginecapacity", label: 'Engine Capacity', type: 'text', tableName: "app_cardetails" },
  { columnName: "MILEAGE", fieldName: "mileage", label: 'Mileage', type: 'text', tableName: "app_cardetails" },
  { columnName: "CITY ", fieldName: "cityname", label: 'City Name', type: 'text', tableName: "app_carcity" },
  { columnName: "DRIVE TYPE", fieldName: "drivetype", label: 'Drive Type', type: 'text', tableName: "app_cardetails" },
  { columnName: "NUMBER OF CYLINDER", fieldName: "noofcylinder", label: 'Number of Cylinder', type: 'text', tableName: "app_cardetails" },
  { columnName: "NUMBER OF SEATS", fieldName: "noofseats", label: 'Number of Seats', type: 'text', tableName: "app_cardetails" },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_cardetails"
  },
  { columnName: "SOLD STATUS", fieldName: "soldstatus", label: 'Sold Status', type: 'text', tableName: "app_cardetails" },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin" },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails" },
  { columnName: "MODIFIED BY", fieldName: "updatedbyname", label: 'Modified By', type: 'text', tableName: "app_userlogin" },
  { columnName: "MODIFIED AT", fieldName: "modified_at", label: 'Modified At', type: 'date', tableName: "app_cardetails" }
];

export const ADDITIONAL_COST_COLUMNS: any[] = [
  { columnName: "CARSHOWROOMREFNO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  { columnName: "ACCOUNT", fieldName: "accountname", label: 'Account Name', type: 'text', tableName: "app_account", },
  { columnName: "SALES ORDER REF NO", fieldName: "salesorderrefno", label: 'Sales Order Ref No', type: 'text', tableName: "app_salesorder" },
  { columnName: "SALES ORDER ", fieldName: "salesordername", label: 'Sales Order Name', type: 'text', tableName: "app_salesorder" },
  { columnName: "SALES Type", fieldName: "salestype", label: 'Sales Type', type: 'text', tableName: "app_opportunity" },
  { columnName: "PAYMENT MODE", fieldName: "paymentmode", label: 'Payment Mode', type: 'text', tableName: "app_opportunity" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "CHASISNO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "GE PROFIT SHARE %", fieldName: "ownersharevalue", label: 'Ge Profit Share %', type: 'text', tableName: "app_cardetails" },
  { columnName: "PURCHASEDATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails" },
  { columnName: "PURCHASEPRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails" },
  { columnName: "WSREPAIR", fieldName: "wsrepair", label: 'Wsrepair', type: 'text', tableName: "app_cardetails" },
  { columnName: "CUSTOMS", fieldName: "customs", label: 'Customs', type: 'text', tableName: "app_cardetails" },
  { columnName: "BSREPAIR", fieldName: "bsrepair", label: 'Bsrepair', type: 'text', tableName: "app_cardetails" },
  { columnName: "RECOVERY", fieldName: "recovery", label: 'Recovery', type: 'text', tableName: "app_cardetails" },
  { columnName: "WARRANTY", fieldName: "warranty", label: 'Warranty', type: 'text', tableName: "app_cardetails" },
  { columnName: "REGISTRATION", fieldName: "registration", label: 'Registration', type: 'text', tableName: "app_cardetails" },
  { columnName: "INSURANCE", fieldName: "insurance", label: 'Insurance', type: 'text', tableName: "app_cardetails" },
  { columnName: "TOTALCOST", fieldName: "totalcost", label: 'Total Cost', type: 'text', tableName: "app_cardetails" },
  // { columnName: "HOLDINGPERIOD", fieldName: "holdingperiod", label: 'Holding Period', type: 'text',tableName:"app_cardetails" },
  { columnName: "SHELFLIFE", fieldName: "shelflife", label: 'Shelf Life', type: 'text', tableName: "app_cardetails" },
  { columnName: "SELLINGPRICE", fieldName: "sellingprice", label: 'Selling Price', type: 'text', tableName: "app_cardetails" },
  { columnName: "SOLDDATE", fieldName: "solddate", label: 'Sold Date', type: 'date', tableName: "app_cardetails" },
  { columnName: "PROFIT", fieldName: "profit", label: 'Profit', type: 'text', tableName: "app_cardetails" },
  { columnName: "MARGIN %", fieldName: "margin", label: 'Margin', type: 'text', tableName: "app_cardetails" }
];

export const ACTIVE_CAR_SALES_REPORT: any[] = [
  { columnName: "CARSHOWROOMREFNO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },
  { columnName: "CHASISNO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },
  { columnName: "GE PROFIT SHARE %", fieldName: "ownersharevalue", label: 'Ge Profit Share %', type: 'text', tableName: "app_cardetails" },
  { columnName: "PURCHASEDATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails" },
  { columnName: "PURCHASEPRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails" },
  { columnName: "WSREPAIR", fieldName: "wsrepair", label: 'Wsrepair', type: 'text', tableName: "app_cardetails" },
  { columnName: "CUSTOMS", fieldName: "customs", label: 'Customs', type: 'text', tableName: "app_cardetails" },
  { columnName: "BSREPAIR", fieldName: "bsrepair", label: 'Bsrepair', type: 'text', tableName: "app_cardetails" },
  { columnName: "RECOVERY", fieldName: "recovery", label: 'Recovery', type: 'text', tableName: "app_cardetails" },
  { columnName: "WARRANTY", fieldName: "warranty", label: 'Warranty', type: 'text', tableName: "app_cardetails" },
  { columnName: "REGISTRATION", fieldName: "registration", label: 'Registration', type: 'text', tableName: "app_cardetails" },
  { columnName: "INSURANCE", fieldName: "insurance", label: 'Insurance', type: 'text', tableName: "app_cardetails" },
  { columnName: "TOTALCOST", fieldName: "totalcost", label: 'Total Cost', type: 'text', tableName: "app_cardetails" },
  { columnName: "HOLDINGPERIOD", fieldName: "holdingperiod", label: 'Holding Period', type: 'text', tableName: "app_cardetails" },
  // { columnName: "SHELFLIFE", fieldName: "shelflife", label: 'Shelf Life', type: 'text',tableName:"app_cardetails" },
  // { columnName: "SELLINGPRICE", fieldName: "sellingprice", label: 'Selling Price', type: 'text',tableName:"app_cardetails" },
  // { columnName: "SOLDDATE", fieldName: "solddate", label: 'Sold Date', type: 'date',tableName:"app_cardetails" },
  // { columnName: "PROFIT", fieldName: "profit", label: 'Profit', type: 'text',tableName:"app_cardetails" },
  // { columnName: "MARGIN", fieldName: "margin", label: 'Margin', type: 'text',tableName:"app_cardetails" },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin" },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails" },

];

export const PRINT_DOCUMENT_HISTORY = [
  { columnName: "NAME", fieldName: "documentname", label: 'Name', type: 'text', tableName: "app_history_doc_printed", },
  { columnName: "REF NO", fieldName: "refno", label: 'Ref No', type: 'text', tableName: "app_cardetails", },
  { columnName: "CONTRACT TYPE", fieldName: "contracttype", label: 'Contract Type', type: 'text', tableName: "app_history_doc_printed", },
  { columnName: "PRINT COUNT", fieldName: "count", label: 'Print Count', type: 'text', tableName: "app_history_doc_printed", },
  { columnName: "USER NAME", fieldName: "createdbyname", label: 'User Name', type: 'text', tableName: "app_userlogin", },
  { columnName: "PRINTED DATE", fieldName: "createdat", label: 'Printed Date', type: 'date', tableName: "app_history_doc_printed", },
  { columnName: "LAST PRINTED DATE", fieldName: "modifiedat", label: 'Last Printed Date', type: 'date', tableName: "app_history_doc_printed", }
];

export const GIFT_DRAW_INVENTORY_COLUMNS = [
  { columnName: "GIFT NAME", fieldName: "gift_name", label: 'Account Category Type', type: 'text', tableName: "app_inventory_master", },
  { columnName: "CATEGORY TYPE", fieldName: "category_type", label: 'Account Name', type: 'text', tableName: "app_inventory_master", },
  { columnName: "CATEGORY NAME", fieldName: "category_name", label: 'First Name', type: 'text', tableName: "app_inventory_master", },
  { columnName: "QUANTITY", fieldName: "qty", label: 'Last Name', type: 'text', tableName: "app_inventory_master", },
  { columnName: "WIN QUANTITY", fieldName: "win_qty", label: 'Mobile', type: 'text', tableName: "app_inventory_master", },
  { columnName: "REMAINING QUANTITY", fieldName: "remaining_qty", label: 'Mobile', type: 'text', tableName: "app_inventory_master", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_inventory_master",
  },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_inventory_master", },
  // { columnName: "MODIFIED BY", fieldName: "updatedbyname", label: 'Modified By', type: 'text', tableName: "app_userlogin", },
  { columnName: "MODIFIED AT", fieldName: "modified_at", label: 'Modified At', type: 'date', tableName: "app_inventory_master", }
];

export const KEY_DRAW_MANAGEMEN_COLUMNS = [
  { columnName: "GENERATED KEY", fieldName: "generated_key", label: 'Account Category Type', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "CRM REF NUM", fieldName: "crm_name", label: 'Account Name', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "CUST CODE", fieldName: "cust_code", label: 'First Name', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "CUSTOMER", fieldName: "customername", label: 'Last Name', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "INVOICE AMOUNT", fieldName: "invoice_amount", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "CATEGORY", fieldName: "category_name", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "CATEGORY TYPE", fieldName: "category_type", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },


  { columnName: "JOB REQUEST NO", fieldName: "job_req_no", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "CAMPAIGN ID", fieldName: "campaign_id", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "GIFT STATUS", fieldName: "gift_status", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "GIFT NAME", fieldName: "gift_name", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "KEY VALIDITY", fieldName: "validity", label: 'Mobile', type: 'date', tableName: "app_key_and_draw_management", },
  { columnName: "GIFT VALIDITY", fieldName: "gift_validity", label: 'Mobile', type: 'date', tableName: "app_key_and_draw_management", },
  { columnName: "GIFT DRAW TIME", fieldName: "gift_draw_time", label: 'Mobile', type: 'date', tableName: "app_key_and_draw_management", },

  { columnName: "PRIZE RECEIVED", fieldName: "prize_received", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "RECEIVED DATE", fieldName: "received_date", label: 'Mobile', type: 'date', tableName: "app_key_and_draw_management", },

  { columnName: "TRANSFERED NAME", fieldName: "transfered_name", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "TRANSFERED PHONE NUMBER", fieldName: "transfered_phone_number", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },
  { columnName: "TRANSFERED PLATE NUMBER", fieldName: "transfered_plate_number", label: 'Mobile', type: 'text', tableName: "app_key_and_draw_management", },


  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_key_and_draw_management", },

  { columnName: "MODIFIED AT", fieldName: "modified_at", label: 'Modified At', type: 'date', tableName: "app_key_and_draw_management", }
];


export const SHORT_LINK_REPORT = [
  { columnName: "SHORT URL", fieldName: "short_url", label: 'SHORT URL', type: 'text', tableName: "app_short_links", },
  { columnName: "ORIGINAL URL", fieldName: "original_url", label: 'ORIGINAL URL', type: 'text', tableName: "app_short_links", },
  { columnName: "CUSTCODE", fieldName: "custcode", label: 'CUSTCODE', type: 'text', tableName: "app_short_links", },
  { columnName: "PLATFORM", fieldName: "platform", label: 'PLATFORM', type: 'text', tableName: "app_short_links", },
  { columnName: "DEVICE ID", fieldName: "device_id", label: 'DEVICE ID', type: 'text', tableName: "app_short_links", },
  { columnName: "MODULE NAME", fieldName: "module_name", label: 'MODULE NAME', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'CREATED AT', type: 'date', tableName: "app_short_links", }
];


export const CASH_REQUEST: any[] = [

  { columnName: "CASH REQUEST REFNO", fieldName: "cashrequesrefno", label: 'Ref No', type: 'text', tableName: "app_carownertype", },
  { columnName: "CASH REQUEST TYPE", fieldName: "cashrequesttype", label: 'CASH REQUEST TYPE', type: 'text', tableName: "app_cashrequest" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "PAYMENT STATUS", fieldName: "paymentstatus", label: 'PAYMENT STATUS', type: 'text', tableName: "app_cashrequest" },
  { columnName: "MODE OF PAYMENT", fieldName: "modeofpayment", label: 'MODE OF PAYMENT', type: 'text', tableName: "app_cashrequest" },
  { columnName: "REQUEST DATE", fieldName: "requestdate", label: 'REQUEST DATE', type: 'date', tableName: "app_cashrequest" },
  { columnName: "AMOUNT", fieldName: "amount", label: 'AMOUNT', type: 'text', tableName: "app_cashrequest" },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_quote"
  },
  { columnName: "CREATED BY ", fieldName: "createdbyname", label: 'Created By Name', type: 'text', tableName: "app_userlogin", },
  { columnName: "CREATED AT", fieldName: "createdat", label: 'Created At', type: 'date', tableName: "app_cashrequest", },
  { columnName: "UPDATED BY ", fieldName: "updatedbyname", label: 'Updated By Name', type: 'text', tableName: "app_userlogin", },
  { columnName: "MODIFIED AT", fieldName: "modifiedat", label: 'Modified At', type: 'date', tableName: "app_cashrequest", },

];


export const SHARE_REPORT: any[] = [
  { columnName: "CARSHOWROOMREFNO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CAR OWNER TYPE", fieldName: "carownertype", label: 'Car Owner Type', type: 'text', tableName: "app_carownertype", },

  { columnName: "CAR OWNER", fieldName: "owner_accountname", label: 'Car Owner', type: 'text', tableName: "app_account", },
  { columnName: "SHARE WITH", fieldName: "sharewith_accountname", label: 'Share With', type: 'text', tableName: "app_account", },


  { columnName: "CHASISNO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },


  { columnName: "GE COST SHARE VALUE", fieldName: "geshareval", label: 'Ge Cost Share Value', type: 'text', tableName: "app_cardetails" },
  { columnName: "GE PROFIT SHARE %", fieldName: "ownersharevalue", label: 'Ge Profit Share %', type: 'text', tableName: "app_cardetails" },
  { columnName: "PURCHASEDATE", fieldName: "purchasedate", label: 'Purchase Date', type: 'date', tableName: "app_cardetails" },
  { columnName: "PURCHASEPRICE", fieldName: "purchaseprice", label: 'Purchase Price', type: 'text', tableName: "app_cardetails" },
  { columnName: "WSREPAIR", fieldName: "wsrepair", label: 'Wsrepair', type: 'text', tableName: "app_cardetails" },
  { columnName: "CUSTOMS", fieldName: "customs", label: 'Customs', type: 'text', tableName: "app_cardetails" },
  { columnName: "BSREPAIR", fieldName: "bsrepair", label: 'Bsrepair', type: 'text', tableName: "app_cardetails" },
  { columnName: "RECOVERY", fieldName: "recovery", label: 'Recovery', type: 'text', tableName: "app_cardetails" },
  { columnName: "WARRANTY", fieldName: "warranty", label: 'Warranty', type: 'text', tableName: "app_cardetails" },
  { columnName: "REGISTRATION", fieldName: "registration", label: 'Registration', type: 'text', tableName: "app_cardetails" },
  { columnName: "INSURANCE", fieldName: "insurance", label: 'Insurance', type: 'text', tableName: "app_cardetails" },
  { columnName: "TOTALCOST", fieldName: "totalcost", label: 'Total Cost', type: 'text', tableName: "app_cardetails" },
  { columnName: "HOLDINGPERIOD", fieldName: "holdingperiod", label: 'Holding Period', type: 'text', tableName: "app_cardetails" },
  // { columnName: "SHELFLIFE", fieldName: "shelflife", label: 'Shelf Life', type: 'text',tableName:"app_cardetails" },
  // { columnName: "SELLINGPRICE", fieldName: "sellingprice", label: 'Selling Price', type: 'text',tableName:"app_cardetails" },
  // { columnName: "SOLDDATE", fieldName: "solddate", label: 'Sold Date', type: 'date',tableName:"app_cardetails" },
  // { columnName: "PROFIT", fieldName: "profit", label: 'Profit', type: 'text',tableName:"app_cardetails" },
  // { columnName: "MARGIN", fieldName: "margin", label: 'Margin', type: 'text',tableName:"app_cardetails" },
  { columnName: "CREATED BY", fieldName: "createdbyname", label: 'Created By', type: 'text', tableName: "app_userlogin" },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_cardetails" },

];


export const PAYMENTDETAILS_COLUMNS = [
  { columnName: "PAYMENT TYPE", fieldName: "pay_type", label: "Payment Type", type: "text", tableName: "app_crm_quotation_payment_details" },
  { columnName: "PAYMENT ACTION", fieldName: "pay_action", label: "Payment Action", type: "text", tableName: "app_crm_quotation_payment_details" },
  { columnName: "CURRENCY", fieldName: "currencycode", label: "Currency Code", type: "text", tableName: "app_crm_quotation_payment_details" },
  { columnName: "AMOUNT", fieldName: "value", label: "Amount", type: "number", tableName: "app_crm_quotation_payment_details" },
  { columnName: "EMAIL", fieldName: "emailaddress", label: "Email Address", type: "text", tableName: "app_crm_quotation_payment_details" },
  
  { columnName: "PAYMENT STATUS", fieldName: "payment_status", label: "Payment Status", type: "text", tableName: "app_crm_quotation_payment_details" },
  { columnName: "CREATED AT", fieldName: "created_at", label: "Created At", type: "date", tableName: "app_crm_quotation_payment_details" },
  { columnName: "CUSTOMER CODE", fieldName: "customercode", label: "Customer Code", type: "text", tableName: "app_crm_quotation_payment_details" },
  { columnName: "CUSTOMER NAME", fieldName: "customername", label: "Customer Name", type: "text", tableName: "app_registration" },
  // { columnName: "QUOTATION ORDER ID", fieldName: "quotation_order_id", label: "Quotation Order ID", type: "text", tableName: "app_crm_quotation_payment_details" },
  { columnName: "ORDER REFERENCE", fieldName: "orderreference", label: "Order Reference", type: "text", tableName: "app_crm_quotation_payment_details" },
  { columnName: "CRM QUOTATION ID", fieldName: "crm_quotation_id", label: "CRM Quotation ID", type: "text", tableName: "app_crm_quotation_payment_details" }
];




export const SPECIAL_OFFER_REPORT_COLUMNS = [
  { columnName: "SPECIAL OFFER", fieldName: "specialoffer_title", label: 'Special Offer', type: 'text', tableName: "app_newspecialoffer", },
  { columnName: "DESCRIPTION", fieldName: "specialofferdesc", label: 'Description', type: 'text', tableName: "app_newspecialoffer", },
  { columnName: "OFFER VALID FROM", fieldName: "offer_valid_from", label: 'Offer Valid From', type: 'date', tableName: "app_newspecialoffer", },
  { columnName: "OFFER VALID TO", fieldName: "offer_valid_to", label: 'Offer Valid To', type: 'date', tableName: "app_newspecialoffer", },
  { columnName: "CMP NAME", fieldName: "cmp_name", label: 'Cmp Name', type: 'text', tableName: "app_company", },
  { columnName: "UNIQUE CODE", fieldName: "unique_code", label: 'Unique Code', type: 'text', tableName: "app_spqrcodegeneration", },
  { columnName: "CUSTOMER CODE", fieldName: "customercode", label: "Customer Code", type: "text", tableName: "app_registration" },
  { columnName: "MOBILE NUMBER", fieldName: "mobilenumber", label: "Mobile Number", type: "text", tableName: "app_registration" },
  { columnName: "REDEEMED COUNT", fieldName: "redeemed_count", label: 'Redeemed Count', type: 'text', tableName: "app_specialofferhistory", },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_newspecialoffer",
  },
  { columnName: "CREATED AT", fieldName: "sp_created_at", label: 'Created At', type: 'date', tableName: "app_newspecialoffer", }
];


export const SPECIAL_OFFER_HISTORY_REPORT_COLUMNS = [
  { columnName: "CUSTOMER NAME", fieldName: "customername", label: "Customer Name", type: "text", tableName: "app_registration" },
  { columnName: "CUSTOMER CODE", fieldName: "customercode", label: "Customer Code", type: "text", tableName: "app_registration" },
  { columnName: "MOBILE NUMBER", fieldName: "mobilenumber", label: "Mobile Number", type: "text", tableName: "app_registration" },
  { columnName: "SPECIAL OFFER", fieldName: "specialoffer_title", label: 'Special Offer', type: 'text', tableName: "app_newspecialoffer", },
  { columnName: "DESCRIPTION", fieldName: "specialofferdesc", label: 'Description', type: 'text', tableName: "app_newspecialoffer", },
  { columnName: "OFFER VALID FROM", fieldName: "offer_valid_from", label: 'Offer Valid From', type: 'date', tableName: "app_newspecialoffer", },
  { columnName: "OFFER VALID TO", fieldName: "offer_valid_to", label: 'Offer Valid To', type: 'date', tableName: "app_newspecialoffer", },
  { columnName: "CMP NAME", fieldName: "cmp_name", label: 'Cmp Name', type: 'text', tableName: "app_company", },
  { columnName: "UNIQUE CODE", fieldName: "unique_code", label: 'Unique Code', type: 'text', tableName: "app_specialofferhistory", },
  { columnName: "REDEEMED COUNT", fieldName: "redeemed_count", label: 'Redeemed Count', type: 'text', tableName: "app_specialofferhistory", },
  {
    columnName: "STATUS", fieldName: "sp_status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_specialofferhistory",
  },
  { columnName: "CREATED AT", fieldName: "sp_created_at", label: 'Created At', type: 'date', tableName: "app_specialofferhistory", }
];


export const INSPECTION_REPORT_REQUESTS_COLUMNS = [
  { columnName: "CAR REF NO", fieldName: "carshowroomrefno", label: 'Car Ref No', type: 'text', tableName: "app_cardetails" },
  { columnName: "BRAND", fieldName: "brandname", label: 'Brand Name', type: 'text', tableName: "app_brand" },
  { columnName: "MODEL", fieldName: "modelname", label: 'Model Name', type: 'text', tableName: "app_model" },
  { columnName: "CHASIS NO", fieldName: "chasisno", label: 'Chasis No', type: 'text', tableName: "app_cardetails" },

  {
    columnName: "REQUEST MODE", fieldName: "request_mode", label: 'Request Mode', type: 'select', options: [
      { label: 'Portal', value: 'PORTAL_APP' },
      { label: 'Mobile App', value: 'MOBILE_APP' }
    ], tableName: "app_inspection_report_requests",
  },
  {
    columnName: "REQUEST STATUS", fieldName: "request_status", label: 'Request Status', type: 'select', options: [
      { label: 'Pending', value: 'PENDING' },
      { label: 'Approved', value: 'APPROVED' },
      { label: 'Rejected', value: 'REJECTED' }
    ], tableName: "app_inspection_report_requests",
  },
  {
    columnName: "STATUS", fieldName: "status", label: 'Status', type: 'select', options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ], tableName: "app_inspection_report_requests",
  },

  { columnName: "REQUESTED BY", fieldName: "requested_by_name", label: 'Requested By', type: 'text', tableName: "app_registration" },
  { columnName: "REQUESTED AT", fieldName: "requested_at", label: 'Requested At', type: 'date', tableName: "app_inspection_report_requests" },

  { columnName: "ACTIONED BY", fieldName: "actioned_by_name", label: 'Actioned By', type: 'text', tableName: "app_userlogin" },
  { columnName: "ACTIONED AT", fieldName: "actioned_at", label: 'Actioned At', type: 'date', tableName: "app_inspection_report_requests" },

  { columnName: "REMARK", fieldName: "remark", label: 'Remark', type: 'text', tableName: "app_inspection_report_requests" },

  { columnName: "CREATED BY", fieldName: "created_by_name", label: 'Created By', type: 'text', tableName: "app_inspection_report_requests" },
  { columnName: "CREATED AT", fieldName: "created_at", label: 'Created At', type: 'date', tableName: "app_inspection_report_requests" },
];