import React, { useState } from "react";
import { Button, ButtonGroup } from "reactstrap";

const CheckButton = (props) => {
  const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);

  const onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
    if (props.onSelectedChange) {
      props.onSelectedChange([...cSelected]);
    }
  };
  return (
    <div>
      <h5>{props.label ? props.label : "check buttons"}</h5>
      <ButtonGroup>
        {props.data && props.data.length > 0 ? (
          props.data.map((v, i) => {
            return (
              <Button
                outline
                color="primary"
                onClick={() => onCheckboxBtnClick(v.id)}
                active={cSelected.includes(v.id)}
              >
                {v.label}
              </Button>
            );
          })
        ) : (
          <p></p>
        )}
      </ButtonGroup>
    </div>
  );
};

export default CheckButton;
