import React, { FC, useEffect, useState } from "react";
import Style from "./style.module.scss";
import { WorkItem } from "./Workitem";
import { SiAzuredevops } from "react-icons/si";
import { FiFilter } from "react-icons/fi";
import { GoCalendar } from "react-icons/go";
import { AiOutlineSetting } from "react-icons/ai";
import { IWorkItem } from "../../providers/devOps/contexts";
import { Button, Empty, Switch } from "antd";
import { FilterForm } from "../configuration/filter";
import { ConfigForm } from "../configuration/settings";
import { useConfigurations } from "../../providers/configurations";
import { EmptyData } from "../Empty";
import { useDevOps } from "../../providers/devOps";
import { WorkItemTypes } from "../../enums";
import { useAuth } from "../../providers/auth";

interface IResolvedPROPs {
  ResolvedItems: Array<IWorkItem>;
}

const ResolvedIsland: FC<IResolvedPROPs> = ({ ResolvedItems }) => {
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [isConfiguring, setIsConfig] = useState<boolean>(false);
  const { getAllConfigurations, configurations, isTracked, updateIsTracked } =
    useConfigurations();
  const { getAllProjects, getWorkItems } = useDevOps();
  const { activeUserInfo } = useAuth();

  useEffect(() => {
    if (!!activeUserInfo?.user?.id) {
      getAllConfigurations(activeUserInfo?.user?.id);
    }
  }, [activeUserInfo?.user?.id]);

  useEffect(() => {
    if (!configurations?.projects?.length && configurations?.userId) {
      getAllProjects();
      setIsFiltering(() => true);
    }
  }, [configurations]);

  useEffect(() => {
    getWorkItems();
  }, [isTracked]);

  const isEditing = isConfiguring || isFiltering;

  return (
    <>
      <div
        style={{
          height: "20px",
          width: "25%",
          color: "black",
          margin: "25px auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SiAzuredevops color="#77CCFF" style={{ margin: "14px 5px" }} />
        <span style={{ margin: "10px 0px" }}>DevOps Resolved Island</span>
      </div>
      <div
        className={
          !isEditing ? Style.devOpsWithFilter : Style.devOpsWithFiltering
        }
      >
        <div
          className={!isEditing ? Style.container : Style.containerFiltering}
        >
          {ResolvedItems?.length ? (
            ResolvedItems?.filter(({ tracked }) => {
              if (!tracked && !isTracked) {
                return true;
              } else if (tracked && isTracked) {
                return true;
              }
            }).map(({ title, workItemType, id, timeEstimate, tracked }) => {
              return (
                <>
                  <WorkItem
                    id={id}
                    details={title}
                    key={id}
                    type={
                      isTracked
                        ? WorkItemTypes?.Recurring
                        : (workItemType as any)
                    }
                    timeEstimate={timeEstimate}
                  />
                </>
              );
            })
          ) : (
            <EmptyData
              buttonDescription="Filter Now"
              description="No work Items Found with the current Filters"
              onEmpty={() => setIsFiltering((prev) => !prev)}
            />
          )}
        </div>
        <div className={Style.openFilter}>
          <div className={Style.configButtons}>
            <Button
              style={{
                border: "none",
                marginBottom: "10px",
              }}
              onClick={() => setIsFiltering((prev) => !prev)}
            >
              <FiFilter size={30} />
            </Button>
            <Button
              style={{
                border: "none",
                backgroundColor: "whitesmoke",
              }}
              disabled
              onClick={() => setIsConfig((prev) => !prev)}
            >
              <AiOutlineSetting size={30} />
            </Button>
            <Switch
              style={{
                border: "none",
                marginTop: "10px",
              }}
              checkedChildren="Tracked"
              unCheckedChildren="UnTracked"
              onChange={(value) => updateIsTracked(value)}
            />
            <Button
              style={{
                border: "none",
                backgroundColor: "whitesmoke",
                marginTop: "10px",
              }}
              disabled
              onClick={() => setIsConfig((prev) => !prev)}
            >
              <GoCalendar size={30} color="green" />
            </Button>
          </div>
        </div>
        <div>
          {isFiltering ? (
            <FilterForm
              isFiltering={isFiltering}
              setIsFiltering={setIsFiltering}
            />
          ) : (
            <ConfigForm
              isConfiguring={isConfiguring}
              setIsConfig={setIsConfig}
            />
          )}
        </div>
      </div>
    </>
  );
};

export { ResolvedIsland };
