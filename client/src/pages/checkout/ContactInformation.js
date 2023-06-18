import styling from "./CheckoutPageOld.module.css";

export default function ContactInformation({ formData, setFormData, handleChange}) {
  return (
    <form>
      <input
        type="text"
        value={formData.email}
        placeholder="Email"
        onChange={(event) => {
            setFormData((prevData) => ({
              ...prevData,
              email: event.target.value,
            }));
        }}
        autoComplete="email"
      />
      <div className={styling.checkboxDiv}>
        <input
          className={styling.checkboxInput}
          type="checkbox"
          name="subscribe"
          checked={formData.subscribe}
          onChange={handleChange}
        />
        <label className={styling.checkboxLabel}>Subscribe</label>
      </div>
    </form>
  );
}
