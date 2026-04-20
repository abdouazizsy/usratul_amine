import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { hadaraDjoumaEvents } from '../data/hadara_djouma_2026_2027'

export const importHadaraDjoumaToFirebase = async () => {
  try {
    console.log('🚀 Début de l\'importation des Hadaras Djouma...')
    
    const hadaraDjoumaCollection = collection(db, 'hadara_djouma_events')
    let imported = 0
    let skipped = 0

    for (const event of hadaraDjoumaEvents) {
      // Vérifier si l'événement existe déjà
      const q = query(
        hadaraDjoumaCollection,
        where('title', '==', event.title),
        where('date', '==', event.date)
      )
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        // L'événement n'existe pas, on l'ajoute
        await addDoc(hadaraDjoumaCollection, {
          ...event,
          category: 'HADARA_DJOUMA',
          createdAt: new Date().toISOString()
        })
        imported++
        console.log(`✅ Importé: ${event.title} (${event.date})`)
      } else {
        skipped++
        console.log(`⏭️  Déjà existant: ${event.title}`)
      }
    }

    console.log(`\n📊 Résumé de l'importation:`)
    console.log(`   ✅ Importés: ${imported}`)
    console.log(`   ⏭️  Ignorés (déjà existants): ${skipped}`)
    console.log(`   📝 Total: ${hadaraDjoumaEvents.length}`)
    console.log(`\n🎉 Importation terminée avec succès!`)

    return { imported, skipped, total: hadaraDjoumaEvents.length }
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error)
    throw error
  }
}
