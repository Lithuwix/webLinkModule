import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Snackbar,
  TextField,
  Typography,
} from "@it-incubator/ui-kit";
import styles from "../WebLinkCreator/WebLinkCreator.module.css";
import webLinksApi from "../../services/webLinksService";
import { toast } from "react-toastify";

export type linkType = {
  id: string;
  longLink: string;
  shortLink: string;
  description: string;
};

export const WebLinkCreator = () => {
  const [newLink, setNewLink] = useState("");
  const [searchField, setSearchField] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");
  const [shortLinkConversion, setShortLinkConversion] = useState("");
  const [longLinkConversion, setLongLinkConversion] = useState("");
  const [timerId, setTimerId] = useState<number | undefined>(undefined);
  const [foundedLinks, setFoundedLinks] = useState<linkType[] | []>([]);
  const [notFound, setNotFound] = useState(false);

  const onClickCreateLinkHandler = () => {
    webLinksApi
      .createLink({ longLink: newLink, description: newLinkDescription })
      .then(() => {
        setNewLink("");
        setNewLinkDescription("");
        toast.success("Ссылка успешно создана!");
      })
      .catch((e: any) => {
        console.log(e.message);
        toast.error("Возникла ошибка при создании ссылки!");
      });
  };

  const onChangeSearchFieldHandler = (value: string) => {
    setSearchField(value);
    setFoundedLinks([]);
  };

  const onChangeShortLinkHandler = (value: string) => {
    setShortLinkConversion(value);
  };

  const onChangeLongLinkHandler = (value: string) => {
    setLongLinkConversion(value);
  };

  // debounce
  useEffect(() => {
    setNotFound(false);
    if (timerId) {
      clearTimeout(timerId);
    }
    if (searchField) {
      const newTimer: any = setTimeout(() => {
        webLinksApi
          .searchLink(searchField)
          .then((res: any) => {
            if (!res.data.length) {
              setNotFound(true);
            } else {
              setFoundedLinks(res.data);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }, 1500);
      setTimerId(newTimer);
    }
  }, [searchField]);

  // debounce
  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    if (longLinkConversion) {
      const newTimer: any = setTimeout(() => {
        webLinksApi
          .convertLink({ longLink: longLinkConversion })
          .then(() => console.log("ok"))
          .catch((e) => {
            console.log(e);
            toast.error("Что-то пошло не так!");
          });
      }, 1500);
      setTimerId(newTimer);
    }
  }, [longLinkConversion]);

  // debounce
  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    if (shortLinkConversion) {
      const newTimer: any = setTimeout(() => {
        webLinksApi
          .convertLink({ shortLink: shortLinkConversion })
          .then(() => console.log("ok"))
          .catch((e) => {
            console.log(e);
            toast.error("Что-то пошло не так!");
          });
      }, 1500);
      setTimerId(newTimer);
    }
  }, [shortLinkConversion]);

  return (
    <div className={styles.wrapper}>
      <Snackbar />
      <Typography.H1 mt={20}>Создать ссылку</Typography.H1>
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
      <Typography.H1 mt={20}>Конвертация ссылки</Typography.H1>
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
      <Typography.H1 mt={20}>Поиск ссылок</Typography.H1>
      <div className={styles.block}>
        <TextField
          onChange={(event) =>
            onChangeSearchFieldHandler(event.currentTarget.value)
          }
          value={searchField}
          placeholder="search"
        />
        {notFound && <Typography.H3 mt={20}>Ничего не нашлось</Typography.H3>}
        {!!foundedLinks.length && (
          <div>
            {foundedLinks.map((link, i) => {
              return <Card key={i}>{link.longLink}</Card>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
