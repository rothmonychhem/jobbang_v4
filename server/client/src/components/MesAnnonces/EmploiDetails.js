import { useState, useEffect } from 'react';
import { useEmploiContext } from "../../hooks/useEmploiContext";
import "./EmploiDetails.css";
import edit from '../../images/edit.png';
import { locations } from '../../data/locations';
import { useEntrepriseContext } from "../../hooks/useEntrepriseContext";

const EmploiDetail = ({ emploi }) => {
  const { entreprise } = useEntrepriseContext();
  const { dispatch } = useEmploiContext();
  const [showDetails, setShowDetails] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);  // Nouvel état
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [visibility, setIsVisible] = useState(emploi.visibility || false);
  const [editedEmploi, setEditedEmploi] = useState({ ...emploi });

  useEffect(() => {
    setIsVisible(emploi.visibility);
  }, [emploi.visibility]);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    if (!entreprise) {
      return;
    }

    const response = await fetch('/api/offreEmploi/' + emploi._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${entreprise.token}`
      }
    });
    const json = await response.json();
    setLoading(false);
    if (response.ok) {
      dispatch({ type: 'DELETE_EMPLOIS', payload: json });
    } else {
      setError('Échec de la suppression: ' + json.message);
    }
  };

  const toggleDetails = () => setShowDetails(prev => !prev);
  const toggleEmail = () => setShowEmail(prev => !prev);
  const toggleEdit = () => setIsEditing(prev => !prev);
  const toggleApplicants = () => setShowApplicants(prev => !prev); // Define the toggle function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmploi(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const updatedEmploi = { ...editedEmploi };

    console.log("Emploi to be saved:", updatedEmploi);

    const response = await fetch('/api/offreEmploi/' + emploi._id, {
      method: 'PATCH',
      body: JSON.stringify(updatedEmploi),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${entreprise.token}`
      }
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'UPDATE_EMPLOIS', payload: updatedEmploi });
      toggleEdit();
    } else {
      setError('Échec de la mise à jour: ' + json.message);
    }

  };

  return (
    <div className="emploi-detail-container">
      <ul className="lmj-emploi-list tata">
        <div className={`emploi-container ${isEditing ? "editing" : ""}`}>
          <div className="image-containerB" onClick={toggleEdit}>
            <img src={edit} alt="edit" className="small-image" />
          </div>
          <h3 className="jobTitle" onClick={toggleDetails} style={{ cursor: "pointer" }}>
            {emploi.nom_poste}
          </h3>
          <span className="jobEntreprise">
            <span className="label">Entreprise:</span> {emploi.nom_entreprise}
          </span>
          <span className="jobLocation">
            <span className="label">Emplacement:</span> {emploi.emplacement}
          </span>
          <span className="jobSalary">
            <span className="label">Salaire:</span> {emploi.salaire}
          </span>
          <span className="jobSector">
            <span className="label">Catégorie:</span> {emploi.categorie}
          </span>
          <button className="buttonAf" onClick={toggleEmail}>
            Afficher l'email
          </button>

          {showEmail && (
            <div className="popup email-popup">
              <div className="popup-content">
                <span className="close" onClick={toggleEmail}>&times;</span>
                <h4>Email: <a href={`mailto:${emploi.candidats}`}>{emploi.candidats}</a></h4>
              </div>
            </div>
          )}

          {showDetails && (
            <div className="details-popup">
              <div className="details-popup-content">
                <span className="close" onClick={toggleDetails}>&times;</span>
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

          {error && <div className="error-message">{error}</div>}

          <button onClick={handleClick} className="delete-button" disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer l\'annonce'}
          </button>

          {showApplicants && (
            <div className="applicants-popup">
              <div className="popup-content">
                <span className="close" onClick={toggleApplicants}>&times;</span>
                <h4>Candidats ayant postulé:</h4>
                {/* Simuler des candidats, à remplacer par un appel API */}
                <ul>
                  <li>John Doe</li>
                  <li>Jane Smith</li>
                  <li>Robert Johnson</li>
                </ul>
              </div>
            </div>
          )}
          <button className="buttonAf" onClick={toggleApplicants}>
            Consulter les candidats
          </button>

          {isEditing && (
            <div className="edit-popup">
              <div className="edit-popup-content">
                <span className="close" onClick={toggleEdit}>&times;</span>
                <h4>Modifier l'offre d'emploi</h4>
                <form onSubmit={handleSubmitEdit} className="edit-job-form">
                  {/* Form fields here */}
                  <button type="submit">Enregistrer les modifications</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default EmploiDetail;
