import { collection, addDoc, getDocs, query, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { tariqaEvents2025_2026 } from '../data/tariqa_events_2025_2026'

export const importTariqaEvents = async () => {
  try {
    const eventsQuery = query(collection(db, 'tariqa_events'))
    const existingEvents = await getDocs(eventsQuery)
    
    if (existingEvents.size > 0) {
      console.log('Les événements de la Tariqa sont déjà importés')
      return { success: false, message: 'Événements déjà importés' }
    }

    let imported = 0
    for (const event of tariqaEvents2025_2026) {
      await addDoc(collection(db, 'tariqa_events'), {
        ...event,
        importedAt: new Date()
      })
      imported++
    }

    console.log(`${imported} événements de la Tariqa importés avec succès`)
    return { success: true, count: imported }
  } catch (error) {
    console.error('Erreur lors de l\'importation des événements:', error)
    return { success: false, error: error.message }
  }
}

export const clearTariqaEvents = async () => {
  try {
    const eventsQuery = query(collection(db, 'tariqa_events'))
    const querySnapshot = await getDocs(eventsQuery)
    
    const deletePromises = querySnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    )
    
    await Promise.all(deletePromises)
    console.log('Tous les événements de la Tariqa ont été supprimés')
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return { success: false, error: error.message }
  }
}
