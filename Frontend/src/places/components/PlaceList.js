import Card from '../../shared/components/UIElements/Card'
import PlaceItem from './PlaceItem'
import Button from '../../shared/components/FormElements/Button'
import { useContext } from 'react'
import AuthContext from '../../shared/context/auth-context'

import './PlaceList.css'
const PlaceList = props => {
    const auth = useContext(AuthContext)
    if (props.items.length === 0) {
        return <div className='place-list center'>
            <Card>
                <h2>No Places found. Maybe Create One?</h2>
                <Button to={auth.isLoggedIn ? '/places/new' : '/auth'}>SharePlace</Button>
            </Card>
        </div>
    }

    return <ul className='place-list'>
        {props.items.map(place => (
            <PlaceItem key={place._id} id={place._id} image={place.image} title={place.title} description={place.description} address={place.address} creatorId={place.creator} coordinates={place.location} onDelete={props.onDeletePlace} />
        ))}
    </ul>
}

export default PlaceList