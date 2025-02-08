import { useState, useContext } from 'react'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import './PlaceItem.css'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'
import AuthContext from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
const PlaceItem = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const auth = useContext(AuthContext)
    const [showMap, setShowMap] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const openMapHandler = () => {
        setShowMap(true)
    }
    const showDeleteWarningHandler = () => {

        setShowConfirmModal(true)
    }
    const cancelDeleteWarningHandler = () => {

        setShowConfirmModal(false)
    }
    const confirmDeleteWarningHandler = async () => {

        setShowConfirmModal(false)
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`

            })
            props.onDelete(props.id)
        }
        catch (error) {

        }


    }
    const closeMapHandler = () => {
        setShowMap(false)
    }
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal show={showMap} onCancel={closeMapHandler} header={props.address} contentClass="place-item__modal-content" footerClass="place-item__modal-actions" footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal show={showConfirmModal} header="Are you sure?" footerClass="place-item__modal-actions" footer={
                <>
                    <Button onClick={cancelDeleteWarningHandler} inverse >CANCEL</Button>
                    <Button onClick={confirmDeleteWarningHandler} danger>DELETE</Button>
                </>
            }>
                <p>Do you want to proceed and delete this place please note that this action can not be undone after</p>
            </Modal>
            <li className='place-item'>
                {isLoading && <LoadingSpinner />}
                <Card className="place-item__content">
                    <div className='place-item__image'>
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.isLoggedIn && auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
                        {auth.isLoggedIn && auth.userId === props.creatorId && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
                    </div>
                </Card>
            </li>
        </>
    )
}

export default PlaceItem