import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";
import RegionManager from "./RegionManager";
import { API_URL } from "../../config";
const ContactInfoManager = () => {
  const [globalContactData, setGlobalContactData] = useState({});
  const [regionContacts, setRegionContacts] = useState({});
  const [regions, setRegions] = useState([]);
  const [newRegionName, setNewRegionName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [newFieldName, setNewFieldName] = useState("");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contact`);
        const data = await res.json();

        if (data) {
          const actualData = Array.isArray(data) ? data[0] : data;
          const {
            _id,
            __v,
            updatedAt: _u,
            createdAt: _c,
            regions: apiRegions,
            countries: _countries,
            ...pureData
          } = actualData;

          setGlobalContactData(pureData);

          if (apiRegions && Array.isArray(apiRegions)) {
            const regionMap = {};
            const regionList = apiRegions.map((reg) => {
              regionMap[reg._id] = reg.contactDetails || {};
              return { _id: reg._id, name: reg.regionName };
            });

            setRegions(regionList);
            setRegionContacts(regionMap);

            if (regionList.length > 0) {
              setSelectedRegion(regionList[0]._id);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching contact data:", err);
      }
    };
    fetchContact();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleGlobalChange = (e) => {
    const { name, value } = e.target;
    setGlobalContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (regionId, fieldName, value) => {
    setRegionContacts((prev) => {
      const currentRegionData = prev[regionId] || {};
      return {
        ...prev,
        [regionId]: {
          ...currentRegionData,
          [fieldName]: value,
        },
      };
    });
  };

  const handleAddGlobalField = () => {
    if (!newFieldName.trim()) return;

    const formattedName = newFieldName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, "");

    if (globalContactData[formattedName] !== undefined) {
      setMessage({ type: "error", text: "This field already exists!" });
      return;
    }

    setGlobalContactData((prev) => ({ ...prev, [formattedName]: "" }));
    setNewFieldName("");
    setMessage({
      type: "success",
      text: `Field '${newFieldName}' added to global contacts!`,
    });
  };

  const handleAddRegionField = () => {
    if (!selectedRegion) {
      setMessage({ type: "error", text: "Please select a region first!" });
      return;
    }
    if (!newFieldName.trim()) return;

    const formattedName = newFieldName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, "");

    const currentRegionData = regionContacts[selectedRegion] || {};
    if (currentRegionData[formattedName] !== undefined) {
      setMessage({
        type: "error",
        text: "This field already exists in this region!",
      });
      return;
    }

    setRegionContacts((prev) => ({
      ...prev,
      [selectedRegion]: {
        ...(prev[selectedRegion] || {}),
        [formattedName]: "",
      },
    }));

    setNewFieldName("");
    setMessage({
      type: "success",
      text: `Field added to ${
        regions.find((r) => r._id === selectedRegion)?.name
      }!`,
    });
  };

  const handleRemoveGlobalField = (key) => {
    if (window.confirm(`Remove '${key}' from global contacts?`)) {
      const newData = { ...globalContactData };
      delete newData[key];
      setGlobalContactData(newData);
      setMessage({ type: "success", text: "Field removed. Save to confirm." });
    }
  };

  const handleRemoveRegionField = (regionId, key) => {
    if (window.confirm(`Remove '${key}' from this region?`)) {
      setRegionContacts((prev) => {
        const newRegionData = { ...prev[regionId] };
        delete newRegionData[key];
        return { ...prev, [regionId]: newRegionData };
      });
      setMessage({ type: "success", text: "Field removed. Save to confirm." });
    }
  };

  const moveField = (isGlobal, regionId, index, direction) => {
    if (isGlobal) {
      const keys = Object.keys(globalContactData);
      const newKeys = [...keys];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newKeys.length) return;

      const temp = newKeys[index];
      newKeys[index] = newKeys[targetIndex];
      newKeys[targetIndex] = temp;

      const newData = {};
      newKeys.forEach((k) => {
        newData[k] = globalContactData[k];
      });
      setGlobalContactData(newData);
    } else {
      const currentData = regionContacts[regionId] || {};
      const keys = Object.keys(currentData);
      const newKeys = [...keys];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newKeys.length) return;

      const temp = newKeys[index];
      newKeys[index] = newKeys[targetIndex];
      newKeys[targetIndex] = temp;

      const newData = {};
      newKeys.forEach((k) => {
        newData[k] = currentData[k];
      });

      setRegionContacts((prev) => ({ ...prev, [regionId]: newData }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      const regionsData = regions.map((reg) => ({
        _id: reg._id,
        regionName: reg.name,
        contactDetails: regionContacts[reg._id] || {},
      }));

      const payload = {
        ...globalContactData,
        regions: regionsData,
      };

      const res = await fetch(`${API_URL}/api/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "All changes saved successfully!",
        });
      } else {
        setMessage({ type: "error", text: "Failed to save changes." });
      }
    } catch (err) {
      console.error("Connection error:", err);
      setMessage({ type: "error", text: "Server connection failed." });
    }
  };

  const globalKeys = Object.keys(globalContactData);
  const selectedRegionData = selectedRegion
    ? regionContacts[selectedRegion] || {}
    : {};
  const selectedRegionKeys = Object.keys(selectedRegionData);

  return (
    <div className={styles.twoColumnLayout}>
      <div className={styles.leftAdminPanel}>
        <h2>Contact & Social Media Manager</h2>

        {message.text && (
          <div
            className={
              message.type === "success"
                ? styles.successAlert
                : styles.errorAlert
            }
          >
            {message.text}
          </div>
        )}

        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabBtn} ${
              !selectedRegion ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedRegion(null)}
          >
            <i className="fas fa-globe"></i> Global Contacts
          </button>
          {regions.map((reg) => (
            <button
              key={reg._id}
              className={`${styles.tabBtn} ${
                selectedRegion === reg._id ? styles.activeTab : ""
              }`}
              onClick={() => setSelectedRegion(reg._id)}
            >
              <i className="fas fa-map-marker-alt"></i> {reg.name}
            </button>
          ))}
        </div>

        {/* GLOBAL CONTACTS FORM */}
        {!selectedRegion && (
          <>
            <div className={styles.addNewFieldBox}>
              <input
                type="text"
                placeholder="New global field (e.g. Main Office Phone)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className={styles.settingsInput}
              />
              <button
                type="button"
                onClick={handleAddGlobalField}
                className={styles.addBtn}
              >
                + Add Global Field
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.contactFormGrid}>
              {globalKeys.map((key, index) => (
                <div key={key} className={styles.settingsGroup}>
                  <div className={styles.labelRow}>
                    <div className={styles.labelActions}>
                      <label>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <div className={styles.orderActionsContainer}>
                        <button
                          type="button"
                          onClick={() => moveField(true, null, index, "up")}
                          className={styles.reorderBtn}
                          disabled={index === 0}
                        >
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveField(true, null, index, "down")}
                          className={styles.reorderBtn}
                          disabled={index === globalKeys.length - 1}
                        >
                          <i className="fas fa-chevron-down"></i>
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGlobalField(key)}
                      className={styles.deleteInlineBtn}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    name={key}
                    className={styles.settingsInput}
                    value={globalContactData[key] || ""}
                    onChange={handleGlobalChange}
                  />
                </div>
              ))}

              {globalKeys.length > 0 && (
                <button type="submit" className={styles.saveActionButton}>
                  Save All Changes
                </button>
              )}
            </form>
          </>
        )}

        {/*CONTACTS FORM */}
        {selectedRegion && (
          <>
            <div className={styles.addNewFieldBox}>
              <input
                type="text"
                placeholder={`New field for ${
                  regions.find((r) => r._id === selectedRegion)?.name
                }`}
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className={styles.settingsInput}
              />
              <button
                type="button"
                onClick={handleAddRegionField}
                className={styles.addBtn}
              >
                + Add Field
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.contactFormGrid}>
              {selectedRegionKeys.map((key, index) => (
                <div key={key} className={styles.settingsGroup}>
                  <div className={styles.labelRow}>
                    <div className={styles.labelActions}>
                      <label>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <div className={styles.orderActionsContainer}>
                        <button
                          type="button"
                          onClick={() =>
                            moveField(false, selectedRegion, index, "up")
                          }
                          className={styles.reorderBtn}
                          disabled={index === 0}
                        >
                          <i className="fas fa-chevron-up"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            moveField(false, selectedRegion, index, "down")
                          }
                          className={styles.reorderBtn}
                          disabled={index === selectedRegionKeys.length - 1}
                        >
                          <i className="fas fa-chevron-down"></i>
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveRegionField(selectedRegion, key)
                      }
                      className={styles.deleteInlineBtn}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    className={styles.settingsInput}
                    value={selectedRegionData[key] || ""}
                    onChange={(e) =>
                      handleRegionChange(selectedRegion, key, e.target.value)
                    }
                  />
                </div>
              ))}

              {selectedRegionKeys.length > 0 && (
                <button type="submit" className={styles.saveActionButton}>
                  Save All Changes
                </button>
              )}
            </form>
          </>
        )}
      </div>

      <div className={styles.rightColumnStack}>
        <RegionManager
          regions={regions}
          setRegions={setRegions}
          newRegionName={newRegionName}
          setNewRegionName={setNewRegionName}
        />
      </div>
    </div>
  );
};

export default ContactInfoManager;
