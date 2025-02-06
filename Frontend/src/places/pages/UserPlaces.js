import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PlaceList from "../components/PlaceList"
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

const UserPlaces = () => {

    const [loadedPlaces, setLoadedPlaces] = useState()
    const { isLoading, sendRequest, error, clearError } = useHttpClient()
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
                setLoadedPlaces(responseData.place)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchPlaces()
    }, [sendRequest, userId])

    const placeDeleteHandler = deletedPlaceId => {
        setLoadedPlaces(places => places.filter((place) => place._id !== deletedPlaceId))
    }
    return <>
        {isLoading && (
            <div className='= center'><LoadingSpinner /></div>
        )}
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
    </>
}
export default UserPlaces