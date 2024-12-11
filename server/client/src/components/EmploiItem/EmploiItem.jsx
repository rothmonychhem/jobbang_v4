import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import PropTypes from "prop-types"; // Import prop-types
import "./EmploiItem.css";
import { useEmploiContext } from "../../hooks/useEmploiContext";
import { useCandidatContext } from "../../hooks/useCandidatContext";
import { useEntrepriseContext } from "../../hooks/useEntrepriseContext";

const EmploiItem = ({ searchTerm, location, likedJobs, setLikedJobs, emploi }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [selectedEmploi, setSelectedEmploi] = useState(null); // Track selected emploi for details
  const { emplois, dispatch } = useEmploiContext();
  const { candidat } = useCandidatContext();
  const { entreprise } = useEntrepriseContext(); // besoin pour update?
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmploi = async () => {
      try {
        const response = await fetch('/api/offreEmploi', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${candidat.token}`
          }
        });
        const json = await response.json();
        if (response.ok) {
          dispatch({ type: 'SET_EMPLOIS', payload: json });
        } else {
          console.error('Error fetching emplois:', json);
        }
      } catch (error) {
        console.error('Error fetching emplois:', error);
      }
    };

    if (candidat && candidat.token) {
      fetchEmploi();
    }
  }, [dispatch, candidat]);

  const handleSubmitPostuler = async (e, emploi) => {
    e.preventDefault();

    
    console.log(emploi);
    console.log("Attempting to apply for job:", emploi._id);

    const response = await fetch(`/api/offreEmploi/postuler/${emploi._id}`, {
      method: 'PATCH',
      body: JSON.stringify(candidat),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidat.token}`,
        
      }
    });

    const json = await response.json();
    if (response.ok) {
      console.log('Application successful:', json);
      setShowMessage(emploi); // Show the message for this specific emploi
    } else {
      console.error('Application failed:', json.message);
      setError('Échec de la candidature: ' + json.message);
    }
  };

  const emploisList = emplois || [];
  const filteredEmplois = emploisList.filter((emploi) => {
    const nomPoste = emploi.nom_poste || ""; // Default value to avoid undefined errors
    const nomCandidat = emploi.nom_candidat || "";
    const categorie = emploi.categorie || "";
    const description = emploi.description || "";
    const emplacement = emploi.emplacement || "";
    return (
      emploi.visibility === true &&
      (nomPoste.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        nomCandidat.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        categorie.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        description.toLowerCase().includes((searchTerm || "").toLowerCase())) &&
      (location === "" || emplacement.toLowerCase().includes((location || "").toLowerCase()))
    );
  });

  const toggleDetails = (emploi) => {
    setSelectedEmploi((prevEmploi) => (prevEmploi === emploi ? null : emploi));
  };

  // Debugging log to check the props
  console.log("Emploi prop value:", emploi);

  return (
    <div>
      <ul className="lmj-emploi-list">
        {filteredEmplois.length > 0 ? (
          filteredEmplois.map((emploi) => (
            <div className="emploi-container" key={emploi._id || emploi.nom_poste}>
              <div
                className="like-icon"
                onClick={() => {
                  const newLikes = new Set(likedJobs);
                  if (newLikes.has(emploi.nom_poste)) {
                    newLikes.delete(emploi.nom_poste);
                  } else {
                    newLikes.add(emploi.nom_poste);
                  }
                  setLikedJobs(newLikes);
                }}
                style={{ cursor: "pointer" }}
              >
                {likedJobs.has(emploi.nom_poste) ? (
                  <FaHeart color="black" />
                ) : (
                  <FaRegHeart color="black" />
                )}
              </div>

              <h3
                className="jobTitle"
                onClick={() => toggleDetails(emploi)}
                style={{ cursor: "pointer" }}
              >
                {emploi.nom_poste}
              </h3>
              <span className="jobCandidat">
                <span className="label">Candidat:</span> {emploi.nom_candidat}
              </span>
              <span className="jobSector">
                <span className="label">Secteur:</span> {emploi.categorie}
              </span>
              <span className="jobSalary">
                <span className="label">Salaire:</span> {emploi.salaire}
              </span>
              <span className="jobLocation">
                <span className="label">Emplacement:</span> {emploi.emplacement}
              </span>

              <form onSubmit={(e) => handleSubmitPostuler(e, emploi)}>
                 <button className="buttonP" type="submit">Postuler</button>
              </form>


              {showMessage === emploi && (
                <div className="popup">
                  <div className="popup-content">
                    <span className="close" onClick={() => setShowMessage(null)}>
                      &times;
                    </span>
                    <h4>Merci d'avoir soumis votre candidature!</h4>
                  </div>
                </div>
              )}

              {selectedEmploi === emploi && (
                <div className="details-popup">
                  <div className="details-popup-content">
                    <span className="close" onClick={() => toggleDetails(emploi)}>
                      &times;
                    </span>
                    <div className="details-content">
                      <h4>Description:</h4>
                      <p>{emploi.description}</p>
                      <h4>Responsabilités:</h4>
                      <p>{emploi.responsabilite}</p>
                      <h4>Exigences:</h4>
                      <p>{emploi.exigence}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <li>Aucune offre d'emploi trouvée.</li>
        )}
      </ul>
    </div>
  );
};

// Prop validation for the emploi prop
EmploiItem.propTypes = {
  emploi: PropTypes.object, // Ensures that emploi is an object (or undefined)
  searchTerm: PropTypes.string,
  location: PropTypes.string,
  likedJobs: PropTypes.object,
  setLikedJobs: PropTypes.func,
};

EmploiItem.defaultProps = {
  emploi: null, // Set default value for emploi
};

export default EmploiItem;
