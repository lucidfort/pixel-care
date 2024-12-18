export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/patient(.*)": ["patient"],
  "/doctor(.*)": ["doctor"],
  "/list/patients": ["admin", "doctor"],
  "/list/nurses": ["admin"],
  "/list/doctors": ["admin"],
  "/list/notifications": ["admin", "doctor", "patient"],
  "/list/announcements": ["admin", "doctor", "patient"],
};
