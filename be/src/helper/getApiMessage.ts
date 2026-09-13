import { ENTITY_ACTION } from "./constants";

const getApiMessage = (entityName: string, action: ENTITY_ACTION) => {
  switch (action) {
    case ENTITY_ACTION.CREATE:
      return `${entityName} created successfully!`;
    case ENTITY_ACTION.UPDATE:
      return `${entityName} updated successfully!`;
    case ENTITY_ACTION.DELETE:
      return `${entityName} deleted successfully!`;
    case ENTITY_ACTION.RETRIEVE:
      return `${entityName} retrieved successfully!`;
    default:
      return "";
  }
};

export default getApiMessage;
