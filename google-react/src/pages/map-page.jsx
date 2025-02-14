import React, { useState, useRef, useEffect } from "react";
import Map from '../components/map-interface.js';
import RoadInf from '../components/road-inf';
import GasInf from '../components/gas-inf';
import { useParams,useHistory } from 'react-router-dom';
import WaterInf from "../components/water-inf";
import ElectrInf from "../components/electr-inf";
import btns from "../staticData/btns.js";
import Relevant from "../components/relevent/relevant";
import { useSelector, useDispatch } from 'react-redux';
import { setLocalty, setPolylines, setRelevants } from '../features/city/citySlice';
import { setActiveEl } from "../features/app/appSlice.js";
import CityService from "../network/city-service";
import CreateIcon from '../static/icons/createIcon.png';
import Button from "../components/button.jsx";
import VericalButton from "../components/VerticalButton.jsx";
import { IoArrowBack } from 'react-icons/io5';
import SidebarModal from "../components/SidebarModal.jsx";
import Modalize from './Modalize';
// import ModalBody from "../components/modal/ModalBody.jsx";
import PolyLineForm from "../components/form/PolylineForm.jsx";


function MapPage() {

  const [isPolyLineCreate, setPolyLineCreate] = useState(false);

  const cityService = new CityService();
  const dispatch = useDispatch();
  let history = useHistory();

  const localty = useSelector(state => state.city.localty);
  const polylines = useSelector(state => state.city.polylines);
  const relevants = useSelector(state => state.city.relevants);

  const [isActiveAllInf, setIsActiveAllInf] = useState(false);
  const [isActiveRelevant, setIsActiveRelevant] = useState(false);

  const activeEl = useSelector(state => state.app.activeEl);
  const activePolyline = useSelector(state => state.city.activePolyline);

  const { localtiesId } = useParams();

  const modRef = useRef(null)

  const openModalize = () => {
    setPolyLineCreate(!isPolyLineCreate)
    modRef.current.open();
  }

  

  useEffect(() => {
    cityService.getLocaltyById(localtiesId)
      .then(data => { dispatch(setLocalty(data)) });

    cityService.getPolyLinesByTypeAndLocalty(activeEl, localtiesId)
      .then(data => dispatch(setPolylines(data)));

    cityService.getRelevantsByTypeAndLocalty(activeEl, localtiesId)
      .then(data => dispatch(setRelevants(data)));

  }, [activeEl,localtiesId])


  const displayAllInf = () => {
    if (activeEl === 1) {
      return <RoadInf item={polylines} ></RoadInf>
    }
    if (activeEl === 2) {
      return <WaterInf item={localty} ></WaterInf>
    }
    if (activeEl === 3) {
      return <ElectrInf item={localty} ></ElectrInf>
    }
    if (activeEl === 4) {
      return <GasInf item={localty} ></GasInf>
    }
  }


  const points = ['50%', '100%'];

  return (
    <div>
      <div className="sidebar">
        <div className="sidebar__header">
          <div className="sidebar__header-left">
            <div onClick={history.goBack} className="back-icon">
              <IoArrowBack className="icon" size={40} />
            </div>
            <h1 className="sidebar__header-title">
              {localty.name}
            </h1>
          </div>
          <div className="sidebar__header-right">
            <div>
              <Button onClick={openModalize} title="Жасау" icon={CreateIcon}></Button>
            </div>
          </div>
        </div>
        <div className="sidebar__body">
          <div className="sidebar__body-row">
            {
              btns.map(btn => (
                <VericalButton key={btn.id} onClick={() => dispatch(setActiveEl(btn.id))}
                  activeItem={btn.id === activeEl}
                  icon={btn.icon}
                  title={btn.title}></VericalButton>
              ))
            }
          </div>
          <div className="sidebar__body-row margin-top">
            <VericalButton onClick={() => setIsActiveAllInf(!isActiveAllInf)}
              activeItem={isActiveAllInf}
              title="Жалпы ақпарат"></VericalButton>
            <VericalButton onClick={() => setIsActiveRelevant(!isActiveRelevant)}
              activeItem={isActiveRelevant}
              title="Өзекті мәселелер"></VericalButton>
          </div>
        </div>
        <Modalize points={points} refProp={modRef}>
          <PolyLineForm></PolyLineForm>
        </Modalize>
        {activePolyline && <SidebarModal></SidebarModal>}
      </div>

      <div className="container-fluid" style={{ padding: 0 + 'px' }}>
        {isActiveAllInf ? (
          <div className="all-inf">
            {displayAllInf()}
          </div>
        ) : ''}
        {isActiveRelevant && (<div className="all-inf"><Relevant relevants={relevants}></Relevant></div>)}
        <div style={{ padding: 0 + 'px' }}>
          {localty.lat ? (
            <Map
            isPolyLineCreate={isPolyLineCreate}
            localty={localty}
            setPolyLineCreate={setPolyLineCreate}></Map>
          ): ''}
        </div>
      </div>
    </div>
  )

}

export default MapPage