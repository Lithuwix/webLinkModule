import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@it-incubator/ui-kit";
import styles from "../WebLinkCreator/WebLinkCreator.module.css";
import webLinksApi from "../../services/webLinksService";

export const WebLinkCreator = () => {
  const [newLink, setNewLink] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");
  const [shortLinkConversion, setShortLinkConversion] = useState("");
  const [longLinkConversion, setLongLinkConversion] = useState("");
  const [timerId, setTimerId] = useState<number | undefined>(undefined);

  const onClickCreateLinkHandler = () => {
    webLinksApi
      .createLink({ longLink: newLink, description: newLinkDescription })
      .then((r) => {
        setNewLink("");
        setNewLinkDescription("");
      })
      .catch((e: any) => {
        console.log(e.message);
      });
  };

  const onChangeShortLinkHandler = (value: string) => {
    setShortLinkConversion(value);
  };

  const onChangeLongLinkHandler = (value: string) => {
    setLongLinkConversion(value);
  };

  // debounce
  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const newTimer: any = setTimeout(() => {
      webLinksApi
        .convertLink({ longLink: longLinkConversion })
        .then(() => console.log("ok"))
        .catch((e) => console.log(e));
    }, 1500);
    setTimerId(newTimer);
  }, [longLinkConversion]);

  // debounce
  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const newTimer: any = setTimeout(() => {
      webLinksApi
        .convertLink({ shortLink: shortLinkConversion })
        .then(() => console.log("ok"))
        .catch((e) => console.log(e));
    }, 1500);
    setTimerId(newTimer);
  }, [shortLinkConversion]);

  return (
    <div className={styles.wrapper}>
      <Typography.H1 ml={10} mt={20}>
        Создать ссылку
      </Typography.H1>
      <div className={styles.block}>
        <TextField
          onChange={(event) => setNewLink(event.currentTarget.value)}
          value={newLink}
          placeholder="link"
        />
        <TextField
          onChange={(event) => setNewLinkDescription(event.currentTarget.value)}
          value={newLinkDescription}
          placeholder="link description"
        />
        <Button variant={"primary"} onClick={onClickCreateLinkHandler}>
          создать ссылку
        </Button>
      </div>
      <Typography.H1 ml={10} mt={20}>
        Конвертация ссылки
      </Typography.H1>
      <div className={styles.block}>
        <TextField
          onChange={(event) => {
            onChangeShortLinkHandler(event.currentTarget.value);
          }}
          value={shortLinkConversion}
          placeholder="short version"
        />
        <TextField
          onChange={(event) => {
            onChangeLongLinkHandler(event.currentTarget.value);
          }}
          value={longLinkConversion}
          placeholder="long version"
        />
      </div>
    </div>
  );
};
