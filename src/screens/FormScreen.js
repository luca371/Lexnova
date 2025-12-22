import "./FormScreen.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function FormScreen() {
  const navigate = useNavigate();
  const [profession, setProfession] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    const formData = {
      nume: e.target[0].value,
      prenume: e.target[1].value,
      profesie: profession,
      anulStudiu:
        profession === "Student"
          ? e.target[3].value
          : null,
      varsta: e.target[profession === "Student" ? 4 : 3].value,
      oras: e.target[profession === "Student" ? 5 : 4].value,
      sursa:
        e.target[profession === "Student" ? 6 : 5]?.value || null,
      completed: true,
      createdAt: new Date(),
    };

    try {
      await setDoc(doc(db, "users", user.uid), formData);
      navigate("/start");
    } catch (err) {
      alert("Eroare la salvare. Încearcă din nou.");
    }
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">
          Spune-ne câteva lucruri despre tine
        </h1>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input required placeholder="Nume" className="form-input" />
          <input required placeholder="Prenume" className="form-input" />

          <select
            required
            className="form-input"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          >
            <option value="">Profesie</option>
            <option value="Student">Student</option>
            <option value="Avocat">Avocat</option>
            <option value="Magistrat">Magistrat</option>
            <option value="Judecator">Judecător</option>
            <option value="Procuror">Procuror</option>
            <option value="Notar">Notar</option>
          </select>

          {profession === "Student" && (
            <select required className="form-input">
              <option value="">Anul de studiu</option>
              <option value="1">Anul 1</option>
              <option value="2">Anul 2</option>
              <option value="3">Anul 3</option>
              <option value="4">Anul 4</option>
            </select>
          )}

          <input required type="number" min="16" placeholder="Vârstă" className="form-input" />
          <input required placeholder="Oraș" className="form-input" />

          <select className="form-input">
            <option value="">De unde ai auzit de noi (opțional)</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Grup facultate">Grup la facultate</option>
          </select>

          <button className="form-button">Continuă</button>
        </form>
      </div>
    </div>
  );
}

export default FormScreen;
