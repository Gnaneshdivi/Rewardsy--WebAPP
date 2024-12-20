import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Drawer, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { openAuthModal } from "../slices/userSlice";
import {redeemOffers} from "../services/OffersService"
import "./OfferCard.css";

const OfferCard = ({ offer, context,code }) => {
  console.log(code);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [redeemCodeLoading, setRedeemCodeLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { userDetails } = useSelector((state) => state.user);
  const MAX_DESCRIPTION_LENGTH = 15; // Adjust based on design preference

  // Handle redeem button click
  const handleRedeemClick = async () => {
    if(isDrawerVisible){
      handleCloseDrawer();
    }
    if (userDetails) {
      setRedeemCodeLoading(true);
      const token = userDetails.token;
      const data = await redeemOffers(offer.id, token);
      if(data?.redirectionLink){
        setRedeemCodeLoading(false);
        const link = data.redirectionLink;
        if (link.startsWith("http") || link.startsWith("https") ) {
          
          window.location.href =link;
        } else {
          navigate(link, { replace: true });
        }
       
      }else{console.log(data);
        setRedeemedCode(data.redemption.code);
        console.log(redeemedCode);
        setRedeemCodeLoading(false);
      }
      
      
    } else {
      dispatch(openAuthModal());
    }
  };

  // Show drawer for more details
  const handleShowDetails = () => setIsDrawerVisible(true);

  // Close drawer
  const handleCloseDrawer = () => setIsDrawerVisible(false);
console.log(offer);
  return (
    <div className="offer-card">
      {/* Top Section: Image and Details */}
      <div className="offer-content">
        <div className="offer-header">
          <div className="offer-image">
            <img src={offer.image} alt={offer.title} />
          </div>
          <div className="offer-details">
          {context!=='store'?(<Row style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
  <h3 className="offer-store-name">{offer.storeName}</h3>
  <img
    src={offer.storeDp}
    alt={`${offer.storeName} logo`}
    className="offer-store-logo"
  />
</Row>
):<></>}
            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-description">
              {context!=='cta'?<span className="view-details" onClick={handleShowDetails}>
                {" "}View Details
              </span>:<></>}
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Divider Section */}
      <div className="ticket-divider">
        <div className="semi-circle-left"></div>
        <div className="dotted-line"></div>
        <div className="semi-circle-right"></div>
      </div>

      {/* Bottom Section: Redeem Button */}
      <div className="redeem-section">
      {redeemedCode ? (
  <p className="code">{redeemedCode}</p>
) : (code?<p className="code">{code}</p>:
  <Button
    className="redeem-button"
    onClick={handleRedeemClick}
    loading={redeemCodeLoading}
  >
    {offer.cta?offer.cta.text:'Redeem'}
  </Button>
)}
      </div>

      {/* Drawer with offer details */}
      <Drawer
  placement="bottom"
  closable={false}
  onClose={handleCloseDrawer}
  open={isDrawerVisible}
  height="40%"
  className="offer-drawer custom-offer-drawer"
  style={{
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  }}
>
  {/* Top Banner Image */}
  {/* <div className="custom-drawer-banner">
    <img src={offer.storeDp} alt="Banner" />
  </div> */}

  <div className="custom-offer-drawer-content">
    {/* Row with Image and Title */}
    <div className="custom-drawer-header">
      <div className="custom-drawer-image">
        <img src={offer.image} alt={offer.title} />
      </div>
      <div className="custom-drawer-title-section">
        <h3 className="custom-drawer-title">{offer.title}</h3>
        <p className="custom-drawer-description">{offer.description}</p>
      </div>
    </div>

    <div className="custom-drawer-divider"></div>
    
    {/* Terms and Conditions */}
    <div className="custom-drawer-tnc-section">
      <h4 className="custom-drawer-tnc-heading">Terms & Conditions</h4>
      <p className="custom-drawer-tnc">Offer Valid from {offer.startDate} to {offer.endDate} Applicable only at the store.</p>
    </div>
  </div>

  {/* Footer with Buttons */}
  <div className="custom-drawer-footer">
    {context!=='store'?(<Button className="custom-drawer-visit-button" onClick={() => navigate(`/store/${offer.store}`)}>
      Visit Store
    </Button>):<></>}
    <Button className="custom-drawer-redeem-button" onClick={handleRedeemClick} loading={redeemCodeLoading}>
      {redeemedCode ? redeemedCode : "Redeem"}
    </Button>
  </div>
</Drawer>




    </div>
  );
};

export default OfferCard;
