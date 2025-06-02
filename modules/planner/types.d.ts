export type PlannerMetaobject = {
  id: string;
  handle: string;
  fields: {
    key: string;
    value: string;
  }[];
};

export type SyncPlannersResponse = {
  success: boolean;
  errors: string[];
};

export type AffiliatePlannerPayload = {
  customerGid: string;
  plannerHandle: string;
};
