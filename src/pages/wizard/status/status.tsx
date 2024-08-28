import React, { useEffect } from 'react';
import { Bot } from "../../../data/types";
import "./status.css";

interface StatusProps {
  bot: Bot;
  setBot: React.Dispatch<React.SetStateAction<Bot>>;
}

const Status: React.FC<StatusProps> = ({ bot, setBot }) => {

  useEffect(() => {
    setBot((prevBot) => ({
      ...prevBot,
      status: prevBot.status || "private",
      allow_edit: prevBot.allow_edit === "True" || prevBot.allow_edit === "False" ? prevBot.allow_edit : "False"
    }));
  }, [setBot]);

  function statusHandle(status: string) {
    setBot((prevBot) => ({ ...prevBot, status }));
  }

  function toggleAllowEdit() {
    setBot((prevBot) => ({
      ...prevBot,
      allow_edit: prevBot.allow_edit === "True" ? "False" : "True"
    }));
  }

  return (
    <div className="status-container">
      <span className="status-title">Are you ready to share {bot.name} Agent?</span>
      <div className="status-radio-buttons">
        <div className={`status-radio-wrapper ${bot.status === "private" ? "active" : ""}`}>
          <label>
            <input
              type="radio"
              name="status"
              value="private"
              checked={bot.status === "private"}
              onChange={() => statusHandle("private")}
            />
            <span>Yes, deploy Private</span>
          </label>
        </div>
        <div className={`status-radio-wrapper ${bot.status === "public" ? "active" : ""}`}>
          <label>
            <input
              type="radio"
              name="status"
              value="public"
              checked={bot.status === "public"}
              onChange={() => statusHandle("public")}
            />
            <span>Yes, deploy Public</span>
          </label>
        </div>
        <div className={`status-radio-wrapper ${bot.status === "draft" ? "active" : ""}`}>
          <label>
            <input
              type="radio"
              name="status"
              value="draft"
              checked={bot.status === "draft"}
              onChange={() => statusHandle("draft")}
            />
            <span>No, save Draft</span>
          </label>
        </div>
      </div>
      <span className="status-title">Allow Editing?</span>
      <div className="status-checkbox-wrapper">
        <label>
          <input
            type="checkbox"
            name="allowEdit"
            checked={bot.allow_edit === "True"}
            onChange={toggleAllowEdit}
          />
          <span>Yes, allow editing</span>
        </label>
      </div>
    </div>
  );
}

export default Status;
