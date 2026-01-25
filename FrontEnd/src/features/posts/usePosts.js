import { useState, useEffect } from 'react';
import steve from "../../images/steve.jpg" // Note: image path might need adjustment or moving to assets

const usePosts = () => {
    // In the future, this will use postApi to fetch data
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Mock data loading
        setPosts([
            {
                id: 1,
                username: "Elon Musk",
                designation: "CEO of Tesla",
                profile_image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
                textPost: "Just launched another rocket! Space exploration is the future.",
                filePost: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            },
            {
                id: 2,
                username: "Bill Gates",
                designation: "Co-founder of Microsoft",
                profile_image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg",
                textPost: "Working on solving climate change challenges.",
                filePost: null
            },
            {
                id: 3,
                username: "Steve Jobs",
                designation: "Co-founder of Apple",
                // profile_image: steve, // TODO: Fix image path handling
                profile_image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Steve_Jobs_Headshot_2010-CROP.jpg",
                textPost: "Stay hungry, stay foolish.",
                filePost: "https://images.unsplash.com/photo-1556656793-02715d8dd6f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2687&q=80"
            }
        ]);
    }, []);

    return { posts };
};

export default usePosts;
