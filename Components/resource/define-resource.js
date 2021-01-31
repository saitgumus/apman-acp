import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  CustomInput,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { InputGroup, InputGroupAddon } from "reactstrap";
import Helper, {
  IsNullOrEmpty,
  ShowStatusError,
  ShowStatusInfo,
  ShowStatusSuccess,
} from "../../utils/Helper";
import { Table } from "reactstrap";
import { AddResource, GetAllResources } from "../../services/resource-service";
import { ResourceContract, ActionContract } from "../../models/resource";
import CheckButton from "../toolbox/check-list";

// ActionContract {
//     actionId;
//     actionName;
//     actionKey;
//     resourceId;
//     operationClaimId;
//   }

/**
 * kaynak ekler
 */
export default class AddResourceComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: 1,
      data: [],
      resourceId: -1,
      resourceCode: "",
      isParent: undefined,
      parentCode: "",
      name: "",
      description: "",
      iconKey: "",
      path: "",
      parentName: "",
      actionList: [],
      openModal: false,
      templateAction: {},
    };
  }

  componentDidMount() {
    this.getResources();
  }

  getResources = async (filterContract = undefined) => {
    if (!filterContract) {
      filterContract = new ResourceContract();
      filterContract.isActive = this.state.isActive;
    }

    await GetAllResources(filterContract)
      .then((res) => {
        if (res.success) {
          this.setState({ data: res.value });
        }
      })
      .catch((err) => {
        ShowStatusError(err);
      });
  };

  addResource = async () => {
    if (
      IsNullOrEmpty(this.state.name) ||
      IsNullOrEmpty(this.state.description) ||
      IsNullOrEmpty(this.state.resourceCode) ||
      (IsNullOrEmpty(this.state.path) && !this.state.isParent)
    ) {
      ShowStatusError("Kaynak ismi, açıklaması veya path'i boş olamaz.");
      return;
    }

    //kaynak parent değil ise..
    if (this.state.isParent === 0) {
      if (IsNullOrEmpty(this.state.parentCode))
        ShowStatusError(
          "eğer ekran parent değilse parent ismi boş olmamalıdır."
        );
    }
    let contract = new ResourceContract();
    contract.name = this.state.name;
    contract.resourceCode = this.state.resourceCode;
    contract.description = this.state.description;
    contract.iconKey = this.state.iconKey;
    contract.isParent = this.state.isParent;
    contract.actionList = this.state.actionList;
    contract.path = this.state.path;
    contract.parentCode = this.state.parentCode;
    contract.isActive = 1; //default aktif kaydedilir.

    await AddResource(contract)
      .then((response) => {
        if (response.success) {
          ShowStatusSuccess("Kaynak tanımı yapıldı.");
        } else {
          ShowStatusError(response.getResultsStringFormat());
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  changeCheckList = (selectedItems) => {
    var items = selectedItems;
    var temp = this.state.templateAction;
    temp.operationClaimIdList = [];
    temp.operationClaimIdList = items;
    temp.operationClaimId =
      items.length > 1 || items.length === 0 ? 0 : items[0];

    this.setState({ templateAction: temp });
  };

  render() {
    return (
      <div style={{ marginTop: "30px" }}>
        <Form>
          <FormGroup>
            <Label for="rcode" sm={4}>
              Kaynak kodu
            </Label>
            <InputGroup>
              <Input
                type="text"
                value={this.state.resourceCode}
                onChange={(e) => {
                  this.setState({ resourceCode: e.target.value.trim() });
                }}
              />
              <InputGroupAddon addonType="append">
                <Button
                  color="success"
                  onClick={(e) => {
                    if (this.state.data.length > 0) {
                      var tmp = this.state.data.find(
                        (x) => x.resourceCode === this.state.resourceCode
                      );
                      if (tmp) {
                        ShowStatusInfo(
                          "mevcutta ekran var : " +
                            tmp.resourceCode +
                            " - " +
                            tmp.name
                        );
                      } else {
                        ShowStatusInfo("mevcut listede tanım yok.");
                      }
                    }
                  }}
                >
                  Kod Sorgula
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="rname">Kaynak Adı</Label>
            <Input
              type="text"
              value={this.state.name}
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="parent" sm={4}>
              Parent Code
            </Label>
            <Input
              sm={8}
              type="text"
              name="parent"
              id="parent"
              disabled={this.state.isParent}
              onChange={(e) => {
                this.setState({ parentCode: e.target.value });
              }}
              value={this.state.parentCode}
            />
          </FormGroup>
          <FormGroup>
            <Label for="path" sm={4}>
              Path
            </Label>
            <Input
              sm={8}
              disabled={this.state.isParent}
              type="text"
              name="path"
              id="path"
              onChange={(e) => {
                this.setState({ path: e.target.value });
              }}
              value={this.state.path}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description" sm={4}>
              Açıklama
            </Label>
            <Input
              sm={8}
              type="text"
              name="description"
              id="description"
              onChange={(e) => {
                this.setState({ description: e.target.value });
              }}
              value={this.state.description}
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              sm={12}
              type="switch"
              id="exampleCustomSwitch"
              name="customSwitch"
              label="Parent Resource"
              onChange={(e) => {
                if (e.target.checked) {
                  this.setState({ isParent: 1 });
                } else {
                  this.setState({ isParent: 0 });
                }
              }}
            />
          </FormGroup>
          <FormGroup>
            <Button
              color="danger"
              onClick={(e) => {
                if (this.state.isParent) {
                  ShowStatusError(
                    "Parent seçili kaynağa aksiyon tanımı yapılamaz."
                  );
                } else this.setState({ openModal: true });
              }}
              disabled={this.state.isParent}
            >
              Aksiyon Ekle
            </Button>
          </FormGroup>
          <FormGroup>
            <p>
              Ekli aksiyonlar.. format:(index - claim id - name - key -
              description)
            </p>
            <ListGroup>
              {this.state.actionList.length > 0 ? (
                this.state.actionList.map((v, i) => {
                  return (
                    <ListGroupItem key={"actlst" + i}>
                      {i + 1} - {v.operationClaimId} - {v.actionName} -{" "}
                      {v.actionKey} - {v.actionDescription}
                    </ListGroupItem>
                  );
                })
              ) : (
                <p></p>
              )}
            </ListGroup>
          </FormGroup>
          <Row>
            <FormGroup>
              <Button
                color={"primary"}
                onClick={(e) => {
                  this.addResource();
                }}
              >
                Kaydet
              </Button>
            </FormGroup>
          </Row>
        </Form>

        <div style={{ marginTop: "30px" }}>
          <h4> Kaynak Listesi</h4>

          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Active</th>
                <th>Parent</th>
                <th>Resource Code</th>
                <th>Name</th>
                <th>Description</th>
                <th>Parent Code</th>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data && this.state.data.length > 0 ? (
                this.state.data.map((val, ind) => {
                  return (
                    <tr key={"msg-tbl-" + ind}>
                      <th scope="row">{ind + 1}</th>
                      <td>{val.isActive}</td>
                      <td>{val.isParent}</td>
                      <td>{val.resourceCode}</td>
                      <td>{val.name}</td>
                      <td>{val.description}</td>
                      <td>{val.parentCode}</td>
                      <td>{val.path}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <th scope="row">1</th>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <Modal returnFocusAfterClose={true} isOpen={this.state.openModal}>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="actname" sm={4}>
                  Aksiyon Adı
                </Label>
                <Input
                  sm={8}
                  type="text"
                  name="actname"
                  id="actname"
                  onChange={(e) => {
                    var act = this.state.templateAction;
                    act.actionName = e.target.value;
                    this.setState({ templateAction: act });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="akey" sm={4}>
                  Aksiyon Key
                </Label>
                <Input
                  sm={8}
                  type="text"
                  name="akey"
                  id="akey"
                  onChange={(e) => {
                    var act = this.state.templateAction;
                    act.actionKey = e.target.value;
                    this.setState({ templateAction: act });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="actdesc" sm={4}>
                  Açıklama
                </Label>
                <Input
                  sm={8}
                  type="text"
                  name="actdesc"
                  id="actdesc"
                  onChange={(e) => {
                    var act = this.state.templateAction;
                    act.actionDescription = e.target.value;
                    this.setState({ templateAction: act });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Card>
                  <CheckButton
                    label="Yetkililer"
                    data={[
                      { id: 2, label: "manager (yönetici)" },
                      { id: 3, label: "member (apartman sakini)" },
                      { id: 4, label: "company (firma)" },
                    ]}
                    onSelectedChange={this.changeCheckList}
                  />
                </Card>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={(e) => {
                var temp = this.state.templateAction;
                if (
                  IsNullOrEmpty(temp.actionName) ||
                  IsNullOrEmpty(temp.actionKey) ||
                  IsNullOrEmpty(temp.actionDescription)
                ) {
                  ShowStatusError(
                    "aksiyon eklemek için bütün alanları doldurun."
                  );
                  return;
                }
                var actions = this.state.actionList;
                actions.push(temp);
                this.setState({ openModal: false, actionList: actions });
              }}
            >
              Ekle
            </Button>
            <Button
              color="primary"
              onClick={(e) => {
                this.setState({ openModal: false });
              }}
            >
              Kapat
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
