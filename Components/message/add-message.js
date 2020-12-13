import React from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { InputGroup, InputGroupAddon } from "reactstrap";
import Helper, {
  ShowStatusError,
  ShowStatusInfo,
  ShowStatusSuccess,
} from "../../utils/Helper";
import { Table } from "reactstrap";
import {
  getAllMessages,
  getMessageByProperty,
  saveMessage,
} from "../../services/message-service";
import { toast } from "react-nextjs-toast";

export default class AddMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageProperty: "",
      messageContent: "",
    };
  }

  componentDidMount() {
    this.getmessage();
  }

  getmessage = async () => {
    var data = await getAllMessages();
    console.log(data);
    if (data && data.length > 0) {
      this.setState({ data: data });
    }
  };

  addMessage = async () => {
    if (
      this.state.messageContent.length < 1 ||
      this.state.messageProperty.length < 1
    ) {
      ShowStatusError("eksik bilgileri doldur.");
      return;
    }
    var res = await saveMessage(
      "sgumus",
      this.state.messageProperty,
      this.state.messageContent
    );
    if (res.errorMessage) {
    } else {
      ShowStatusSuccess("mesaj eklendi.");
      this.setState({ messageContent: "", messageProperty: "" });
      this.getmessage();
    }
  };

  selectMessage = async () => {
    var res = await getMessageByProperty(this.state.messageProperty);
    if (res.errorMessage) {
      ShowStatusError(res.errorMessage);
    } else if (res.value) {
      if (res.value && res.value.length > 0) {
        ShowStatusInfo("mesaj mevcutta var:" + res.value);
      } else {
        ShowStatusInfo("mesaj bulunamadı.");
      }
    }
  };

  render() {
    return (
      <div style={{ marginTop: "30px" }}>
        <Form>
          <FormGroup>
            <InputGroup>
              <Input
                type="text"
                value={this.state.messageProperty}
                placeholder="Property Name"
                onChange={(e) => {
                  this.setState({ messageProperty: e.target.value });
                }}
              />
              <InputGroupAddon addonType="append">
                <Button
                  color="success"
                  onClick={(e) => {
                    this.selectMessage();
                  }}
                >
                  Property Sorgula
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="property" hidden>
              Property
            </Label>
            <Input
              type="text"
              name="messageprop"
              id="property"
              placeholder="mesaj property"
              onChange={(e) => {
                this.setState({ messageProperty: e.target.value });
              }}
              value={this.state.messageProperty}
            />
          </FormGroup>{" "}
          <FormGroup>
            <Label for="message" hidden>
              Message
            </Label>
            <Input
              type="text"
              name="message"
              id="message"
              placeholder="mesaj içeriği"
              onChange={(e) => {
                this.setState({ messageContent: e.target.value });
              }}
              value={this.state.messageContent}
            />
          </FormGroup>{" "}
          <Button
            color={"primary"}
            onClick={(e) => {
              this.addMessage();
            }}
          >
            Kaydet
          </Button>
        </Form>

        <div style={{ marginTop: "30px" }}>
          <h4> Mesaj Listesi</h4>

          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Author</th>
                <th>Property</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data && this.state.data.length > 0 ? (
                this.state.data.map((val, ind) => {
                  return (
                    <tr key={"msg-tbl-" + ind}>
                      <th scope="row">{ind + 1}</th>
                      <td>{val.author}</td>
                      <td>{val.property}</td>
                      <td>{val.description}</td>
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
      </div>
    );
  }
}
