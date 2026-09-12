import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Leaf,
} from "lucide-react";

import "./Profile.css";

function Profile() {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error reading user:", error);
  }

  const name = user?.name || "Farmer";
  const email = user?.email || "Not available";
  const phone = user?.phone || "Not available";
  const role = user?.role || "Farmer";

  const avatarLetter =
    name.trim().charAt(0).toUpperCase() || "F";

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <div>
          <span className="page-eyebrow">
            FARMER ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            View your registered KrishiSetu account
            information.
          </p>
        </div>

      </div>


      {/* PROFILE CARD */}

      <section className="profile-card">

        {/* PROFILE TOP */}

        <div className="profile-top">

          <div className="profile-avatar">
            {avatarLetter}
          </div>

          <div className="profile-main-info">

            <h2>
              {name}
            </h2>

            <span className="profile-role">
              <Leaf size={15} />
              {role.toUpperCase()}
            </span>

          </div>

        </div>


        <div className="profile-divider" />


        {/* ACCOUNT DETAILS */}

        <div className="profile-details">

          {/* EMAIL */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <Mail size={20} />
            </div>

            <div>
              <span>
                Email
              </span>

              <strong>
                {email}
              </strong>
            </div>

          </div>


          {/* PHONE */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <Phone size={20} />
            </div>

            <div>
              <span>
                Phone
              </span>

              <strong>
                {phone}
              </strong>
            </div>

          </div>


          {/* ROLE */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <span>
                Account Type
              </span>

              <strong>
                {role}
              </strong>
            </div>

          </div>


          {/* USER ID */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <User size={20} />
            </div>

            <div>
              <span>
                User ID
              </span>

              <strong>
                {user?.id || "Not available"}
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* ACCOUNT STATUS */}

      <section className="profile-status">

        <div className="status-icon">
          <ShieldCheck size={20} />
        </div>

        <div>
          <strong>
            Account verified
          </strong>

          <p>
            Your KrishiSetu account is successfully
            connected to your registered information.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Profile;