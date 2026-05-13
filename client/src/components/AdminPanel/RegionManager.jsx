import styles from "./AdminPanel.module.css";

const RegionManager = ({
  regions,
  setRegions,
  newRegionName,
  setNewRegionName,
}) => {
  const handleAddRegion = () => {
    if (!newRegionName.trim()) return;
    const newReg = { _id: Date.now().toString(), name: newRegionName };
    setRegions([...regions, newReg]);
    setNewRegionName("");
  };

  const deleteRegion = (id) => {
    setRegions(regions.filter((r) => r._id !== id));
  };

  return (
    <div className={styles.rightAdminPanel}>
      <h3>Region Management</h3>
      <div className={styles.addNewFieldBox}>
        <input
          type="text"
          placeholder="New Region (e.g. Asia)"
          value={newRegionName}
          onChange={(e) => setNewRegionName(e.target.value)}
          className={styles.settingsInput}
        />
        <button
          type="button"
          onClick={handleAddRegion}
          className={styles.addBtn}
        >
          + Add
        </button>
      </div>

      <div className={styles.regionList}>
        {regions.map((reg) => (
          <div key={reg._id} className={styles.regionItem}>
            <span>{reg.name}</span>
            <button
              type="button"
              onClick={() => deleteRegion(reg._id)}
              className={styles.deleteInlineBtn}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionManager;
