// import { View, Text } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { DeviceMotion, LightSensor } from 'expo-sensors'

// type Props = {
//   values: Record<string, string | number | boolean | null | undefined>
// }

// const TestPanel = ({ values }: Props) => {
//   return (
//     <View style={{ backgroundColor: 'red', position: 'absolute', top: 50, padding: 6, zIndex: 9999 }}>
//       {Object.entries(values).map(([label, value]) => (
//         <Text key={label} style={{ color: 'white', fontSize: 10 }}>
//           {label}: {String(value)}
//         </Text>
//       ))}
//     </View>
//   )
// }

// const DebugPanel = () => {
//   const [debugValues, setDebugValues] = useState({
//     tiltX: 0,
//     tiltY: 0,
//     lux: 0,
//     speed: 0,
//   })

//   useEffect(() => {
//     DeviceMotion.setUpdateInterval(16)
//     const motionSub = DeviceMotion.addListener(({ rotation }) => {
//       setDebugValues(prev => ({
//         ...prev,
//         tiltX: Number(rotation.beta.toFixed(3)),
//         tiltY: Number(rotation.gamma.toFixed(3)),
//       }))
//     })
//     return () => motionSub.remove()
//   }, [])

//   useEffect(() => {
//     const lightSub = LightSensor.addListener(({ illuminance }) => {
//       const mapped = Math.min(1.0, Math.max(0.2, illuminance / 1000))
//       setDebugValues(prev => ({
//         ...prev,
//         lux: Math.round(illuminance),
//         speed: Number(mapped.toFixed(3)),
//       }))
//     })
//     return () => lightSub.remove()
//   }, [])

//   return <TestPanel values={debugValues} />
// }

// export default DebugPanel

import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { DeviceMotion, LightSensor } from 'expo-sensors'

type DebugValues = {
  label: string
  value: string
}

const getLuxLabel = (lux: number): string => {
  if (lux < 10) return 'very dark'
  if (lux < 100) return 'dim'
  if (lux < 500) return 'indoor'
  if (lux < 2000) return 'bright indoor'
  if (lux < 10000) return 'overcast outside'
  return 'direct sunlight'
}

const getTiltXLabel = (beta: number): string => {
  if (beta > 1.2) return 'face down'
  if (beta > 0.4) return 'tilting forward'
  if (beta > -0.4) return 'flat'
  if (beta > -1.2) return 'tilting back'
  return 'face up'
}

const getTiltYLabel = (gamma: number): string => {
  if (gamma > 0.6) return 'leaning right'
  if (gamma > 0.2) return 'slight right'
  if (gamma > -0.2) return 'centered'
  if (gamma > -0.6) return 'slight left'
  return 'leaning left'
}

const TestPanel = ({ values }: { values: DebugValues[] }) => {
  return (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.75)', position: 'absolute', top: 50, padding: 8, zIndex: 9999, borderRadius: 8, minWidth: 180 }}>
      {values.map(({ label, value }) => (
        <Text key={label} style={{ color: 'white', fontSize: 10, marginBottom: 2 }}>
          <Text style={{ color: '#a0f143' }}>{label}</Text>: {value}
        </Text>
      ))}
    </View>
  )
}

const DebugPanel = () => {
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [lux, setLux] = useState(0)
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    DeviceMotion.setUpdateInterval(16)
    const motionSub = DeviceMotion.addListener(({ rotation }) => {
      setTiltX(Number(rotation.beta.toFixed(3)))
      setTiltY(Number(rotation.gamma.toFixed(3)))
    })
    return () => motionSub.remove()
  }, [])

  useEffect(() => {
    const lightSub = LightSensor.addListener(({ illuminance }) => {
      const mapped = Math.min(1.0, Math.max(0.2, illuminance / 1000))
      setLux(Math.round(illuminance))
      setSpeed(Number(mapped.toFixed(3)))
    })
    return () => lightSub.remove()
  }, [])

  const values: DebugValues[] = [
    { label: 'tiltX (β)', value: `${tiltX} — ${getTiltXLabel(tiltX)}` },
    { label: 'tiltY (γ)', value: `${tiltY} — ${getTiltYLabel(tiltY)}` },
    { label: 'lux', value: `${lux} — ${getLuxLabel(lux)}` },
    { label: 'speed mult', value: String(speed) },
  ]

  return <TestPanel values={values} />
}

export default DebugPanel