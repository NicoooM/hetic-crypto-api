import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Types pour nos données
interface Node {
  id: string;
  date: Date;
}

interface Link {
  source: string;
  target: string;
  date: Date;
  value: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const TransactionGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-01-01'));
  const [progress, setProgress] = useState<number>(0);
  
  // Données exemple (à remplacer par vos vraies données)
  const sampleData: GraphData = {
    nodes: [
      { id: "mainWallet", date: new Date('2024-01-01') }, 
      { id: "transaction1", date: new Date('2024-01-02') },
      { id: "transaction2", date: new Date('2024-01-03') },
      { id: "transaction3", date: new Date('2024-01-04') },
      { id: "transaction4", date: new Date('2024-01-05') },
      { id: "transaction5", date: new Date('2024-01-06') },
      { id: "transaction6", date: new Date('2024-01-07') },
      { id: "transaction7", date: new Date('2024-01-08') },
      { id: "transaction8", date: new Date('2024-01-09') },
      { id: "transaction9", date: new Date('2024-01-10') },
      { id: "transaction10", date: new Date('2024-01-11') },
      { id: "transaction11", date: new Date('2024-01-12') },
      { id: "transaction12", date: new Date('2024-01-13') },
      { id: "transaction13", date: new Date('2024-01-14') },
      { id: "transaction14", date: new Date('2024-01-15') },
      { id: "transaction15", date: new Date('2024-01-16') },
      { id: "transaction16", date: new Date('2024-01-17') },
      { id: "transaction17", date: new Date('2024-01-18') },
      { id: "transaction18", date: new Date('2024-01-19') },
      { id: "transaction19", date: new Date('2024-01-20') },
      { id: "transaction20", date: new Date('2024-01-21') },
      { id: "transaction21", date: new Date('2024-01-22') },
      { id: "transaction22", date: new Date('2024-01-23') },
      { id: "transaction23", date: new Date('2024-01-24') },
      { id: "transaction24", date: new Date('2024-01-25') },
      { id: "transaction25", date: new Date('2024-01-26') },
      { id: "transaction26", date: new Date('2024-01-27') },
      { id: "transaction27", date: new Date('2024-01-28') },
      { id: "transaction28", date: new Date('2024-01-29') },
      { id: "transaction29", date: new Date('2024-01-30') },
      { id: "transaction30", date: new Date('2024-01-31') },
    ],
    links: [
      { source: "mainWallet", target: "transaction1", date: new Date('2024-01-01'), value: 100 },
      { source: "mainWallet", target: "transaction2", date: new Date('2024-01-02'), value: 200 },
      { source: "mainWallet", target: "transaction3", date: new Date('2024-01-03'), value: 150 },
      { source: "mainWallet", target: "transaction4", date: new Date('2024-01-04'), value: 300 },
      { source: "mainWallet", target: "transaction5", date: new Date('2024-01-05'), value: 250 },
      { source: "mainWallet", target: "transaction6", date: new Date('2024-01-06'), value: 400 },
      { source: "mainWallet", target: "transaction7", date: new Date('2024-01-07'), value: 350 },
      { source: "mainWallet", target: "transaction8", date: new Date('2024-01-08'), value: 450 },
      { source: "mainWallet", target: "transaction9", date: new Date('2024-01-09'), value: 500 },
      { source: "mainWallet", target: "transaction10", date: new Date('2024-01-10'), value: 600 },
      { source: "mainWallet", target: "transaction11", date: new Date('2024-01-11'), value: 550 },
      { source: "mainWallet", target: "transaction12", date: new Date('2024-01-12'), value: 700 },
      { source: "mainWallet", target: "transaction13", date: new Date('2024-01-13'), value: 650 },
      { source: "mainWallet", target: "transaction14", date: new Date('2024-01-14'), value: 800 },
      { source: "mainWallet", target: "transaction15", date: new Date('2024-01-15'), value: 750 },
      { source: "mainWallet", target: "transaction16", date: new Date('2024-01-16'), value: 900 },
      { source: "mainWallet", target: "transaction17", date: new Date('2024-01-17'), value: 850 },
      { source: "mainWallet", target: "transaction18", date: new Date('2024-01-18'), value: 1000 },
      { source: "mainWallet", target: "transaction19", date: new Date('2024-01-19'), value: 950 },
      { source: "mainWallet", target: "transaction20", date: new Date('2024-01-20'), value: 1100 },
      { source: "mainWallet", target: "transaction21", date: new Date('2024-01-21'), value: 1050 },
      { source: "mainWallet", target: "transaction22", date: new Date('2024-01-22'), value: 1200 },
      { source: "mainWallet", target: "transaction23", date: new Date('2024-01-23'), value: 1150 },
      { source: "mainWallet", target: "transaction24", date: new Date('2024-01-24'), value: 1300 },
      { source: "mainWallet", target: "transaction25", date: new Date('2024-01-25'), value: 1250 },
      { source: "mainWallet", target: "transaction26", date: new Date('2024-01-26'), value: 1400 },
      { source: "mainWallet", target: "transaction27", date: new Date('2024-01-27'), value: 1350 },
      { source: "mainWallet", target: "transaction28", date: new Date('2024-01-28'), value: 1500 },
      { source: "mainWallet", target: "transaction29", date: new Date('2024-01-29'), value: 1450 },
      { source: "mainWallet", target: "transaction30", date: new Date('2024-01-30'), value: 1600 },
    ]
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 928;
    const height = 600;


    // Nettoyer le SVG existant
    d3.select(svgRef.current).selectAll("*").remove();

    // Créer le SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("width", width)
      .attr("height", height);

    // Créer les éléments graphiques
    const link = svg.append("g")
      .selectAll("line")
      .data(sampleData.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6);

    // Créer un div pour la tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "absolute hidden bg-black text-white p-2 rounded text-sm")
      .style("pointer-events", "none");

    // Fonction pour calculer le rayon en fonction de la valeur
    const getRadius = (d: any) => {
      if (d.id === "mainWallet") return 15;
      const link = sampleData.links.find(l => l.target === d.id);
      if (!link) return 5;
      // Normaliser la valeur entre 5 et 12 pixels
      return 5 + (link.value / 1600) * 7; // 1600 est la valeur max dans notre exemple
    };

    // Modifier la création des nœuds
    const node = svg.append("g")
      .selectAll("circle")
      .data(sampleData.nodes)
      .join("circle")
      .attr("r", getRadius)
      .attr("fill", d => d.id === "mainWallet" ? "#ff0000" : "#69b3a2")
      .on("mouseover", (event, d: any) => {
        const filteredData = filterDataByTime(currentDate); // Mettre à jour selon le contexte
        const link = filteredData.links.find(l => l.target === d.id);
        const value = link ? link.value : 0;

        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .style("display", "block")
          tooltip.html(
            `Wallet: ${d.id}<br>Value: ${value || 'N/A'}`
          );
          
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      });

    // Simulation
    const simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink().id((d: any) => d.id))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

      const filterDataByTime = (time: Date) => {
        const filteredNodes = sampleData.nodes.filter(node => node.date <= time);
        const nodeIds = new Set(filteredNodes.map(node => node.id));
      
        const filteredLinks = sampleData.links.filter(link => {
          return nodeIds.has(link.source) && nodeIds.has(link.target) && link.date <= time;
        });
      
        return {
          nodes: filteredNodes,
          links: filteredLinks
        };
      };

    // Animation modifiée
    let currentTime = new Date(sampleData.nodes[0].date.getTime() - 86400000);
    const startDate = sampleData.nodes[0].date;
    const endDate = sampleData.nodes[sampleData.nodes.length - 1].date;
    const totalDuration = endDate.getTime() - startDate.getTime();

    const timer = d3.interval(() => {
      // Vérifier si nous avons atteint la fin
      if (currentTime >= endDate) {
        timer.stop();
        return;
      }
      
      currentTime = new Date(currentTime.getTime() + 86400000 / 10);
      const filteredData = filterDataByTime(currentTime);
      
      // Assurer que le progress ne dépasse pas 100%
      const currentProgress = Math.min(
        ((currentTime.getTime() - startDate.getTime()) / totalDuration) * 100,
        100
      );
      
      setCurrentDate(currentTime);
      setProgress(currentProgress);
      
      // Mettre à jour la simulation
      simulation
        .nodes(filteredData.nodes as any)
        .force("link", d3.forceLink(filteredData.links).id((d: any) => d.id))
        .alpha(1)
        .restart();
    }, 20);

    // Fonction tick pour mettre à jour les positions
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    // Nettoyage
    return () => {
      timer.stop();
      simulation.stop();
      d3.selectAll(".tooltip").remove();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Timeline personnalisée */}
      <div className="w-full px-4">
        <div className="relative w-full h-8">
          {/* Barre de progression */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-200">
            <div 
              className="h-full bg-blue-500 transition-all duration-100" 
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Date courante */}
          <div className="absolute top-4 right-0 text-sm font-medium">
            {currentDate.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Graphique D3 */}
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default TransactionGraph;