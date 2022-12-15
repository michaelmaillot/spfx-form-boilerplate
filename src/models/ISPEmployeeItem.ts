export interface ISPEmployeeItem {
    Title: string;
    Description: string;
    Complete: boolean;
    Completeby: string;
    Completedon: Date;
    Mentor: {Id: string, EMail: string};
    Relevantlink: {Url: string, Description: string};
  }