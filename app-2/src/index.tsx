/*
  Using the import(...) syntax instead of import "..." 
  solves Shared Modules Not Available error as it synchronizes
  modules loading.
  
  See: https://www.linkedin.com/pulse/uncaught-error-shared-module-available-eager-rany-elhousieny-phd%E1%B4%AC%E1%B4%AE%E1%B4%B0/
*/

import("./bootstrap");

// this needs to be present or else TS loader will complain.
export {};
