import User from "../model/user.model.js";
import Event from "../model/event.model.js";

/**
 * Update user profile (supports both old and new schema)
 */
export const updateProfile = async (req, res) => {
  try {
    const {
      // name, // old schema
      firstName,
      lastName,
      email,
      organisation,
      title,
      telephone,
      member,
      allergies,
      // age, // old schema
      // sex, // old schema
    } = req.body;

    // Check required fields (based on new or old format)
    if (!firstName  || !email) {
      return res
        .status(400)
        .json({ message: "Le nom et l'email sont requis" });
    }

    // Check if email is already in use by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.userId },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Cette adresse email est déjà utilisée" });
    }

    // Build update data dynamically
    const updateData = {
      email,
      // --- Old schema fallback ---
      // name: name || undefined,
      // age: age || undefined,
      // sex: sex || undefined,
      // --- New schema fields ---
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      organisation: organisation || undefined,
      title: title || undefined,
      telephone: telephone || undefined,
      member: member || undefined,
      allergies: allergies || undefined,
    };

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du profil" });
  }
};

/**
 * Delete user account (unchanged except cleanup improvements)
 */
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Remove user from any event registration
    await Event.updateMany(
      { registeredUsers: req.userId },
      { $pull: { registeredUsers: req.userId } }
    );

    // Delete user account
    await User.findByIdAndDelete(req.userId);

    // Clear authentication cookie
    res.clearCookie("usertoken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Error in deleteAccount controller:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du compte" });
  }
};
