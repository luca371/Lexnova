import "./FormScreen.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function FormScreen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    profesie: "",
    anulStudiu: "",
    varsta: "",
    oras: "",
    sursa: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);

    const payload = {
      nume: formData.nume,
      prenume: formData.prenume,
      profesie: formData.profesie,
      anulStudiu:
        formData.profesie === "Student"
          ? formData.anulStudiu
          : null,
      varsta: Number(formData.varsta),
      oras: formData.oras,
      sursa: formData.sursa || null,
      completed: true,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "users", user.uid), payload);
      navigate("/start");
    } catch (err) {
      alert("Eroare la salvare. Încearcă din nou.");
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">
          Spune-ne câteva lucruri despre tine
        </h1>

        <form className="form-grid" onSubmit={handleSubmit}>
          {/* NUME */}
          <input
            required
            placeholder="Nume"
            className="form-input"
            value={formData.nume}
            onChange={(e) => handleChange("nume", e.target.value)}
          />

          {/* PRENUME */}
          <input
            required
            placeholder="Prenume"
            className="form-input"
            value={formData.prenume}
            onChange={(e) => handleChange("prenume", e.target.value)}
          />

          {/* PROFESIE */}
          <select
            required
            className="form-input"
            value={formData.profesie}
            onChange={(e) =>
              handleChange("profesie", e.target.value)
            }
          >
            <option value="">Profesie</option>
            <option value="Student">Student</option>
            <option value="Avocat">Avocat</option>
            <option value="Magistrat">Magistrat</option>
            <option value="Judecator">Judecător</option>
            <option value="Procuror">Procuror</option>
            <option value="Notar">Notar</option>
          </select>

          {/* AN STUDIU */}
          {formData.profesie === "Student" && (
            <select
              required
              className="form-input"
              value={formData.anulStudiu}
              onChange={(e) =>
                handleChange("anulStudiu", e.target.value)
              }
            >
              <option value="">Anul de studiu</option>
              <option value="1">Anul 1</option>
              <option value="2">Anul 2</option>
              <option value="3">Anul 3</option>
              <option value="4">Anul 4</option>
            </select>
          )}

          {/* VARSTA */}
          <input
            required
            type="number"
            min="16"
            placeholder="Vârstă"
            className="form-input"
            value={formData.varsta}
            onChange={(e) =>
              handleChange("varsta", e.target.value)
            }
          />

          {/* ORAS */}
          <input
            required
            placeholder="Oraș"
            className="form-input"
            value={formData.oras}
            onChange={(e) =>
              handleChange("oras", e.target.value)
            }
          />

          {/* SURSA */}
          <select
            className="form-input"
            value={formData.sursa}
            onChange={(e) =>
              handleChange("sursa", e.target.value)
            }
          >
            <option value="">
              De unde ai auzit de noi (opțional)
            </option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Grup facultate">
              Grup la facultate
            </option>
          </select>

          {/* SUBMIT */}
          <button
            className="form-button"
            disabled={loading}
          >
            {loading ? "Se salvează..." : "Continuă"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormScreen;
