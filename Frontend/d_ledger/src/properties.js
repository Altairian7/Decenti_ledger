import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, Text } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useControls } from 'leva'
import { useNavigate } from 'react-router-dom'
import { auth } from './firebaseConfig'
import Navbar from './NavBar'

extend({ MeshLineGeometry, MeshLineMaterial })
useGLTF.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')


const getIpfsUrl = (hash) => `https://ipfs.io/ipfs/${hash}`;


function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

const FullscreenStyle = () => (
  <style>
    {`
      body, #root {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
      }
      .fullscreen-canvas {
        width: 100vw !important;
        height: 100vh !important;
        position: fixed !important;
        top: 0;
        left: 0;
      }
    `}
  </style>
)

export default function App() {
  const navigate = useNavigate()
  const [estates, setEstates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [account, setAccount] = useState(null)
  const { debug } = useControls({ debug: false })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchEstates(user.uid)
      } else {
        navigate('/login')
      }
    })

    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0])
          } else {
            console.warn('No accounts found, prompting user.');
          }
        })
        .catch((error) => {
          console.error('MetaMask connection failed:', error);
        });
    } else {
      console.warn('MetaMask is not installed.');
    }

    return () => unsubscribe()
  }, [navigate])

  const fetchEstates = async (userUid) => {
    try {
      const response = await fetch(`http://192.168.137.1:5000/api/papers/papers/?user_uid=${userUid}`);
      if (response.ok) {
        const data = await response.json()
        setEstates(data)
      } else {
        setError('Failed to fetch estates')
      }
    } catch (error) {
      setError('Error fetching estates')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const spacing = 3
  const totalWidth = (estates.length - 1) * spacing
  const startX = -totalWidth / 2

  return (
    <>
      <Navbar />
      <FullscreenStyle />
      <Canvas
        className="fullscreen-canvas"
        camera={{ position: [0, 0, 14], fov: 25 }}
        style={{ position: 'fixed', top: 0, left: 0, touchAction: 'none' }}>
        <ambientLight intensity={2} />
        <directionalLight
          position={[0, 10, 5]}
          intensity={2}
          color="teal"
        />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          color="white"
        />
        <Physics debug={debug} interpolate gravity={[0, -50, 0]} timeStep={1 / 60}>
          {estates.map((data, index) => (
            <Band
              key={data.ipfs_hash}
              propertyData={data}
              position={[startX + (index * spacing), 1.2, 0]}
            />
          ))}
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={['#3a3a3a']} />
          <Lightformer intensity={3} color="white" position={[0, 5, 2]} rotation={[0, 0, -Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        </Environment>
      </Canvas>

    </>
  )
}

function CardContent({ data }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(getIpfsUrl(data.ipfs_hash));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-${data.ipfs_hash.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <group position={[0, 0.59, 0.04]} scale={0.035}>
      <Text position={[0, 4, 0]} fontSize={2.5} color="black">{data.title}</Text>
      <Text position={[0, 1.7, 0]} fontSize={2} color="gray">{data.city}</Text>
      <Text position={[0, -6, 0]} fontSize={1.5} color="gray">
        {`Size: ${data.land_size} sq.m`}
      </Text>
      <Text position={[0, -2, 0]} fontSize={1.5} color="gray">
        {formatDate(data.uploaded_at)}
      </Text>
      <Text position={[0, -4, 0]} fontSize={1.2} color="#4a90e2">
        {`IPFS: ${data.ipfs_hash.slice(0, 8)}...`}
      </Text>

      <Text
        position={[0, -10, 0]}
        fontSize={2}
        color={isHovered ? "#2a70c2" : "#4a90e2"}
        onClick={handleDownload}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        DOWNLOAD
      </Text>
    </group>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10, position = [0, 0, 0], propertyData, index, totalCards }) {
  const bandRef = useRef()
  const fixedRef = useRef()
  const j1Ref = useRef()
  const j2Ref = useRef()
  const j3Ref = useRef()
  const cardRef = useRef()

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  const segmentProps = { type: 'dynamic', canSleep: false, colliders: false, angularDamping: 2, linearDamping: 2 }
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixedRef, j1Ref, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1Ref, j2Ref, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2Ref, j3Ref, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3Ref, cardRef, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
        ;[cardRef, j1Ref, j2Ref, j3Ref, fixedRef].forEach((ref) => ref.current?.wakeUp())
      cardRef.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }

    if (fixedRef.current && bandRef.current) {
      ;[j1Ref, j2Ref].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      curve.points[0].copy(j3Ref.current.translation())
      curve.points[1].copy(j2Ref.current.lerped)
      curve.points[2].copy(j1Ref.current.lerped)
      curve.points[3].copy(fixedRef.current.translation())
      bandRef.current.geometry.setPoints(curve.getPoints(32))

      ang.copy(cardRef.current.angvel())
      rot.copy(cardRef.current.rotation())
      cardRef.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'

  return (
    <group position={position}>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixedRef} {...segmentProps} type="fixed" />
        <RigidBody position={[1, 0, 0]} ref={j1Ref} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2Ref} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3Ref} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[4, 0, 0]} ref={cardRef} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(cardRef.current.translation()))))}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial color="beige" clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            <CardContent data={propertyData} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={bandRef}>
        <meshLineGeometry />
        <meshLineMaterial color="#4a90e2" depthTest={false} resolution={[width, height]} lineWidth={1} />
      </mesh>
    </group>
  )
}