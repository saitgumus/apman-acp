export class ActionContract {
  actionId;
  actionName;
  actionKey;
  resourceId;
  operationClaimId;
  operationClaimIdList;
}

export class ResourceContract {
  resourceId;
  resourceCode;
  isParent;
  parentCode;
  name;
  description;
  iconKey;
  path;
  parentName;
  actionList;
  isActive;
  constructor() {
    this.actionList = [];
  }
}
