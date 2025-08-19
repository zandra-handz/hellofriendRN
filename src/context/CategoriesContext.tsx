// NOT CURRENTLY IN USE BUT AVAILABLE IF NEED TO SEPARATE CATEGORIES FRM SETTNIGS! (comment out on backend too)

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
  useRef,
} from "react";
import { useUser } from "./UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserCategory,
  updateUserCategory,
  deleteUserCategory,
  getUserCategories,
} from "../calls/api";

interface Categories {
  //   id: number | null;
  //   user: number | null;
  //   expo_push_token: string | null;
  //   high_contrast_mode: boolean;
  //   interests: string | null;
  //   language_preference: string | null;
  //   large_text: boolean;
  //   manual_dark_mode: boolean;
  //   receive_notifications: boolean;
  //   screen_reader: boolean;
}

interface CategoriesContextType {}

const CategoriesContext = createContext<Categories | undefined>(undefined);

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error(
      "useCategories must be used within a UserCategoriesProvider"
    );
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children,
}) => {
  const { user, isInitializing  } = useUser();
  // console.log("CATEGORIES CONTEXT");

  const queryClient = useQueryClient();

    const timeoutRef = useRef(null);

  const {
    data: userCategories,
   
    isSuccess, 
  } = useQuery({
    queryKey: ["categories", user?.id],
    queryFn: () => getUserCategories(user?.id),
    enabled: !!(user?.id && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  });


  
  // useEffect(() => {
  //   if (isSuccess && categories) { 

  //     setUserCategories(categories || []);
  //   }
  // }, [isSuccess, categories]);

  // const [userCategoriez, setUserCategories] = useState<any[]>([]);
 

  const createNewCategoryMutation = useMutation({
    mutationFn: (data) => createUserCategory(user?.id, data),
    onSuccess: (data) => { 
      // setUserCategories((prev) => [...prev, data]);
 

      queryClient.setQueryData(["categories", user?.id], (oldData: any[]) => {
        if (!oldData) return [data];  

        handleSyncStats();

        const updatedList = [...oldData, data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        
        return updatedList;
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data) => updateUserCategory(user?.id, data.id, data.updates),
    onSuccess: (data) => {
      // setUserCategories((prev) => {
      //   const updated = prev.map((cat) => (cat.id === data.id ? data : cat));

      //   return updated;
      // });

      // console.log("After updating cached categories:", updatedCategories);
   
      // return updatedCategories;

      queryClient.setQueryData(["categories", user?.id], (oldData: any[]) => {
        if (!oldData) return oldData;
        console.log(oldData.map((cat) => (cat.id === data.id ? data : cat)));
        return oldData.map((cat) => (cat.id === data.id ? data : cat));
      });
         handleSyncStats();

            if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateCategoryMutation.reset();
      }, 1000);


    },

    onError: (error) => {
      console.error("Update app categories error:", error);
                  if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateCategoryMutation.reset();
      }, 1000);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (data) => deleteUserCategory(user?.id, data.id),
    onSuccess: (data) => {
      // console.log("Deleted category data:", data);

      // setUserCategories((prev) =>
      //   prev.filter((category) => category.id !== data.id)
      // );
 

      handleSyncStats();
 

      queryClient.setQueryData(["categories", user?.id], (oldData: any[]) => {
        if (!oldData) return oldData;
 

        return oldData.filter((cat) => cat.id !== data.id);
      });
    },

    onError: (error) => {
      console.error("Update app categories error:", error);
    },
  });

  const createNewCategory = async (newCategoryData) => {
    try {
      const updatedData =
        await createNewCategoryMutation.mutateAsync(newCategoryData);

      if (updatedData) {
        console.log(`in createNewCategory`, updatedData);
        return updatedData;
      }
    } catch (error) {
      console.error("Error creating new category: ", error);
    }
  };

  const updateCategory = async (categoryData) => {
    try {
      await updateCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app categories:", error);
    }
  };

  const deleteCategory = async (categoryData) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app categories:", error);
    }
  };

  const handleSyncStats = () => {
    queryClient.refetchQueries({ queryKey: ["userStats"] });
    queryClient.refetchQueries({ queryKey: ["selectedFriendStats"] });
 
  }; 
  const contextValue = useMemo(
    () => ({
      // categories,
      userCategories,
      createNewCategory,
      createNewCategoryMutation,
      updateCategory,
      updateCategoryMutation,
      deleteCategory,
      deleteCategoryMutation,
    }),
    [
      userCategories,
      createNewCategoryMutation,
      updateCategoryMutation,
      deleteCategoryMutation,
    ]
  );

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
};
