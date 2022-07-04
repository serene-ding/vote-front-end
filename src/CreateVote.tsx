import { useImmer } from "use-immer";
import { useInput } from "./hooks";
import { useToggle } from "ahooks";
import {
  Button,
  DatePicker,
  Dialog,
  Form,
  Input,
  Switch,
  Toast,
} from "antd-mobile";
import dayjs from "dayjs";
import { RefObject, useEffect, useState } from "react";
import { AddCircleOutline, DeleteOutline } from "antd-mobile-icons";
import type { DatePickerRef } from "antd-mobile/es/components/date-picker";
import styles from "./CreateVote.module.css";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
//@ts-ignore
globalThis.axios = axios;
export default function CreateVote() {
  const [params, searchParams] = useSearchParams();
  let navigate = useNavigate();
  const type = params.get("type");
  useEffect(() => {
    console.log(type, "type");
  }, [type]);

  const now = new Date();
  const title = useInput("");
  const description = useInput("");
  const deadline = useInput("");
  const onFinish = async () => {
    let info = {
      title: title.value,
      desc: description.value,
      deadline: deadline.value,
      anonymous: anonymous,
      multiple: type === "multiple",
      options: options,
    };
    console.log(info);
    let res = await axios.post("/vote", info);
    console.log(typeof res.data.result.voteId, "id");
    navigate("/vote/" + res.data.result.voteId);
  };
  const [options, updateOptions] = useImmer<string[]>(["", ""]);
  function addOption() {
    updateOptions((options) => {
      options.push("");
    });
  }
  function delOption(index: number) {
    updateOptions((options) => {
      options.splice(index, 1);
    });
  }
  function editOption(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    updateOptions((options) => {
      options[index] = e.target.value;
    });
  }
  function editOptionAnt(s: string, index: number) {
    updateOptions((options) => {
      options[index] = s;
    });
  }
  let SorM;
  if (type === "multiple") {
    SorM = "多选";
  } else {
    SorM = "单选";
  }
  const [anonymous, { toggle }] = useToggle(false);
  return (
    <div>
      {/* <div>
        标题：
        <input type="text" {...title} />
      </div>
      <div>
        描述：
        <input type="text" {...description} />
      </div>
      {options.map((option, index) => {
        return (
          <div key={index}>
            <button
              onClick={() => {
                delOption(index);
              }}
            >
              -
            </button>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                editOption(e, index);
              }}
            />
          </div>
        );
      })}
      <div>
        <button onClick={addOption}>添加选项</button>
      </div>
      <div>
        截止日期：
        <input type="datetime-local" {...deadline} />
      </div>
      <div>
        <label>
          <input type="checkbox" checked={anonymous} onChange={toggle} />
          匿名投票
        </label>
      </div> */}

      <h1 className={styles.SorM}>{"创建" + SorM + "投票"}</h1>
      <Form
        onFinish={onFinish}
        layout="horizontal"
        footer={
          <Button block type="submit" color="primary" size="large">
            完成
          </Button>
        }
      >
        <Form.Item name="title">
          <Input
            style={{ "--font-size": "25px" }}
            {...title}
            placeholder="投票标题"
          />
        </Form.Item>
        <Form.Item name="description">
          <Input {...description} placeholder="补充描述（选填）" />
        </Form.Item>
        {options.map((option, index) => {
          return (
            <Form.Item key={index}>
              <div
                onClick={() => {
                  console.log("click");
                }}
                className={styles.Option}
                style={{ color: "var(--adm-color-danger)" }}
              >
                <div
                  className={styles.IconBox}
                  onClick={() => {
                    delOption(index);
                  }}
                >
                  <DeleteOutline />
                </div>
                <Input
                  style={{ "--font-size": "15px", color: "grey" }}
                  name="option"
                  onChange={(s) => {
                    editOptionAnt(s, index);
                  }}
                  placeholder="选项"
                />
              </div>
            </Form.Item>
          );
        })}

        <Form.Item>
          <div
            onClick={() => {
              addOption();
            }}
            className={styles.Option}
            style={{ color: "var(--adm-color-primary)" }}
          >
            <div className={styles.IconBox}>
              <AddCircleOutline color="var(--adm-color-primary)" />
            </div>
            <div>添加选项</div>
          </div>
        </Form.Item>

        <Form.Item
          name="anonymous"
          label="匿名投票"
          childElementPosition="right"
        >
          <Switch
            checked={anonymous}
            onChange={toggle}
            style={{
              "--checked-color": "#00b578",
            }}
          />
        </Form.Item>
        <Form.Item
          name="dealine"
          label="截止日期"
          trigger="onConfirm"
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            datePickerRef.current?.open();
          }}
        >
          <DatePicker
            min={now}
            precision="minute"
            value={new Date(deadline.value)}
            onConfirm={(val) => {
              deadline.onChange(val.toString());
            }}
          >
            {(value) =>
              value ? dayjs(value).format("YYYY-MM-DD") : "请选择日期"
            }
          </DatePicker>
        </Form.Item>
      </Form>
    </div>
  );
}
