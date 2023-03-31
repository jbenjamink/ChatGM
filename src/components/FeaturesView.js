import { useState } from "react";

function FeatureView({ passedFeatures = [] }) {
    const [features, setFeatures] = useState(passedFeatures);

    const [newFeatureName, setNewFeatureName] = useState("");
    const [newFeatureDescription, setNewFeatureDescription] = useState("");

    const addFeature = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/addFeature", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: newFeatureName, description: newFeatureDescription })
            });

            if (!response.ok) {
                throw new Error("Failed to add feature.");
            }

            setFeatures([...features, { name: newFeatureName, description: newFeatureDescription, starred: false }]);
            setNewFeatureName("");
            setNewFeatureDescription("");
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStar = async (index) => {
        try {
            const updatedFeatures = [...features];
            updatedFeatures[index].starred = !updatedFeatures[index].starred;
            setFeatures(updatedFeatures);

            const response = await fetch("/api/updateFeature", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedFeatures[index])
            });

            if (!response.ok) {
                throw new Error("Failed to update feature.");
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="container mx-auto mt-4">
            <div className="w-full mb-8 overflow-hidden-lg shadow-lg">
                <div className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-md font-semibold tracking-wide text-left uppercase border-b border-gray">
                                <th className="px-4 py-3">Feature Name</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Starred</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray">
                            {features.map((feature, index) => (
                                <tr key={index} className="border-gray">
                                    <td className="px-4 py-3 whitespace-no-wrap">{feature.name}</td>
                                    <td className="px-4 py-3 whitespace-pre-wrap">{feature.description}</td>
                                    <td className="px-4 py-3 whitespace-no-wrap">
                                        <i className={`fa-stars text-yellow-400 cursor-pointer ${feature.starred ? 'fa-solid' : 'fa-thin'}`} onClick={() => toggleStar(index)}></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <form onSubmit={addFeature} className="mx-auto max-w-[400px] flex-1 mt-6 md:mt-2">
                <h1 className="font-display text-title font-medium tracking-wide uppercase mt-50 mb-50">Add Feature</h1>
                <div className="mb-4">
                    <label htmlFor="name" className="block font-bold mb-2 text-xs font-semibold uppercase italic text-white">
                        Feature Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                        className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block font-bold mb-2 text-xs font-semibold uppercase italic text-white">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={newFeatureDescription}
                        onChange={(e) => setNewFeatureDescription(e.target.value)}
                        className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button type="submit" className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline">
                    Add Feature
                </button>
            </form>
        </div >
    );
}

export default FeatureView;