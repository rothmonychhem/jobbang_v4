import OffreEmploi from '../models/OffreEmploi.js';
import mongoose from 'mongoose';

//avoir tt les offres
const avoirOffres = async (req,res) => {
    try {
        let offresEmploi;

        // Vérifier si l'utilisateur est une entreprise ou un candidat
        if (req.entreprise) {
            // Si entreprise : avoir toutes les offres de l'entrepreneur connecté
            const entreprise_id = req.entreprise._id;
            offresEmploi = await OffreEmploi.find({ entreprise_id }).sort({ createdAt: -1 });
        } else {
            // Si candidat : avoir toutes les offres de tous les entrepreneurs
            offresEmploi = await OffreEmploi.find({}).sort({ createdAt: -1 });
        }

        res.status(200).json(offresEmploi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* 

const avoirOffres = async (req,res) => {
    //si candidat:
    //avoir toutes les offres de tout les entrepreneur ayant mis une offre

    //si entreprise:
    //avoir toutes les offre de l'entrepreneur connecter
    const entreprise_id = req.entreprise._id

    const offreEmploi = await OffreEmploi.find({).sort({createdAt: -1});
    res.status(200).json(offreEmploi);
}

*/


//avoir une offre
const avoirOffre = async(req,res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).json({error: 'il ny a pas cette offre'});
    }
    const offreEmploi = await OffreEmploi.findById(id);

    if(!offreEmploi){
      return res.status(404).json({error: 'pas ce genre doffre'});
        }
    res.status(200).json(offreEmploi);
}



//cree une offre
const creeOffre = async(req,res) =>
     {
    const{nom_entreprise,nom_poste,salaire,emplacement,categorie,email_employeur, description, responsabilite, exigence, visibility} = req.body;

try{
    const entreprise_id = req.entreprise._id
    const emploi = await OffreEmploi.create({
        nom_entreprise,nom_poste,salaire,emplacement,categorie,email_employeur, description, responsabilite, exigence,entreprise_id, visibility
    });
    res.status(200).json(emploi);
    }catch(error){
    res.status(400).json({error: error.message});
}}

//supprimer une offre
const supprimerEmploi = async (req,res) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).json({error: 'il ny a pas cette offre'});
    }
    const offreEmploi = await OffreEmploi.findOneAndDelete({_id: id});

    if(!offreEmploi){
      return res.status(404).json({error: 'pas ce genre doffre'});
        }
    res.status(200).json(offreEmploi);
}


//modifier une offre
const modifierEmploi = async(req,res) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){

        return res.status(404).json({error: 'il ny a pas cette offre'});
    }
    const offreEmploi = await OffreEmploi.findOneAndUpdate({_id: id},
    {   ...req.body });

    if(!offreEmploi){
      return res.status(404).json({error: 'pas ce genre doffre'});
        }
    res.status(200).json(offreEmploi);
}



const postulerEmploi = async (req, res) => {
    const { id } = req.params;

    // Extract the current user's email from the request object
    const { email_candidat } = req.candidat;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Il n'y a pas cette offre" });
    }

    try {
        // Add the user's email to the candidats list in the job offer
        const offreEmploi = await OffreEmploi.findOneAndUpdate(
            { _id: id },
            { $addToSet: { candidats: email_candidat } }, // Prevent duplicate entries
            { new: true } // Return the updated document
        );

        if (!offreEmploi) {
            return res.status(404).json({ error: "Pas ce genre d'offre" });
        }

        res.status(200).json({ message: "Candidature enregistrée avec succès.", offreEmploi });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue.", details: error.message });
    }
};





//git
export { 
    creeOffre,
    avoirOffre, 
    avoirOffres ,
    supprimerEmploi,
    modifierEmploi, postulerEmploi};

