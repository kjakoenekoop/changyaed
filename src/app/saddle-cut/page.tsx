"use client"

import { useEffect, useRef, useState } from "react"

enum Unit { MM = "mm", INCH = "in" }

const Page = () => {
    const [pipe1, setPipe1] = useState({ diameter: 0, unit: Unit.MM })
    const [pipe2, setPipe2] = useState({ diameter: 0, unit: Unit.MM })
    const [viewbox, setViewbox] = useState("")
    const pathElement = useRef<SVGPathElement>(null)

    useEffect(() => {
        if (pathElement.current) {
            const path = pathElement.current.getBBox();
            setViewbox(`${path.y - 2} ${path.y - 2} ${path.width + 4} ${path.height + 4}`)
        }
    }, [
        pipe1.diameter, pipe2.diameter
    ])

    return (
        <main className="px-4 py-6 grid grid-cols-[auto,1fr]">
            <div className="flex flex-col gap-y-2">
                <div className="text-sm w-60 bg-zinc-100 rounded-md border pl-2 py-0.5 pr-0.5 grid grid-cols-[10rem,4rem]">
                    <input className="m-0 p-2 bg-zinc-100" type="number" placeholder="Diameter 1" onChange={(e) => setPipe1({ ...pipe1, diameter: Number(e.target.value) })} />
                    <select className="px-2 bg-zinc-50 rounded-sm text-zinc-600" onChange={(e) => setPipe1({ ...pipe1, unit: e.target.value as Unit })}>
                        <option value={Unit.MM}>mm</option>
                        <option value={Unit.INCH}>in</option>
                    </select>
                </div>
                <div className="text-sm w-60 bg-zinc-100 rounded-md border pl-2 py-0.5 pr-0.5 grid grid-cols-[10rem,4rem]">
                    <input className="m-0 p-2 bg-zinc-100" type="number" placeholder="Diameter 2" onChange={(e) => setPipe2({ ...pipe2, diameter: Number(e.target.value) })} />
                    <select className="px-2 bg-zinc-50 rounded-sm text-zinc-600" onChange={(e) => setPipe2({ ...pipe1, unit: e.target.value as Unit })}>
                        <option value={Unit.MM}>mm</option>
                        <option value={Unit.INCH}>in</option>
                    </select>
                </div>
            </div>

            <div className="py-4 resize overflow-auto">

                <svg className="block"
                    viewBox={viewbox}
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        ref={pathElement}
                        vectorEffect="non-scaling-stroke"
                        className="fill-none stroke-black stroke-2 overflow-auto"
                        d={`${getPathFromCoordinates(getCoordinates({
                            pipeSmallDiameter: Math.min(pipe1.diameter, pipe2.diameter),
                            pipeLargeDiameter: Math.max(pipe1.diameter, pipe2.diameter)
                        }))} `}
                    />
                </svg>

            </div>

        </main>
    )
}

const getCoordinates = ({ pipeSmallDiameter = 0, pipeLargeDiameter = 0 }) => {
    const coordinates = [];
    for (let degree = 0; degree <= 360; degree++) {
        const radians = (degree + 90) * Math.PI / 180;
        const distance = pipeLargeDiameter / 2 - Math.sqrt(
            Math.pow(pipeLargeDiameter / 2, 2) -
            Math.pow(pipeSmallDiameter / 2 * Math.sin(radians), 2)
        )
        coordinates[degree] = { x: pipeSmallDiameter * Math.PI / 360 * degree, y: distance };
    }
    return coordinates;
}

const getPathFromCoordinates = (coordinates: { x: number, y: number }[]) => {
    return coordinates.map(({ x, y }) => {
        const command = x === 0 ? "M" : "L";
        return `${command} ${x} ${y}`
    }).join(" ")
}

export default Page
