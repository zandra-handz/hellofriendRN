import React, { createContext, useContext, useMemo, useRef } from "react";
import { useUser } from "./UserContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import { fetchPastHelloes, saveHello, deleteHelloAPI } from "../calls/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  eachMonthOfInterval,
  startOfMonth,
  getDaysInMonth,
  format,
} from "date-fns";

const HelloesContext = createContext({});

export const useHelloes = () => {
  return useContext(HelloesContext);
};

export const HelloesProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { selectedFriend } = useSelectedFriend();
  const {  user, isAuthenticated } = useUser();

  const timeoutRef = useRef(null);

  const {
    data: helloesList,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["pastHelloes", selectedFriend?.id],
    queryFn: () => {
      //console.log('Fetching past helloes for:', selectedFriend?.id);
      return fetchPastHelloes(selectedFriend.id);
    },
    enabled: !!(user && isAuthenticated && selectedFriend),
    onSuccess: () => {
      // groupByMonthAndYear(data);
      // const inPerson = data[0].filter(hello => hello.type === 'in person');
      // queryClient.setQueryData(['inPersonHelloes', selectedFriend?.id], inPerson);
      //console.log('cached in person helloes: ', data);
    },
    onError: () => {
      console.log("error in RQ fetching helloes");
    },
  });

  const helloesIsFetching = isFetching;
  //(Not sure which one to use)
  const helloesIsLoading = isLoading;
  const helloesIsError = isError;
  const helloesIsSuccess = isSuccess;

  const inPersonHelloes = useMemo(() => {
    if (helloesList) {
      const inPerson = helloesList.filter(
        (hello) => hello.type === "in person"
      );
      queryClient.setQueryData(
        ["inPersonHelloes", selectedFriend?.id],
        inPerson
      );

      console.log("filtering helloes in useMemo function");
      return inPerson;
    }
  }, [helloesList]);

  const getCachedInPersonHelloes = () => {
    return queryClient.getQueryData(["inPersonHelloes", selectedFriend?.id]);
  };

  //   useEffect(() => {
  //     // Log the cached data for 'pastHelloes'
  //     const cachedHelloes = queryClient.getQueryData(['pastHelloes', selectedFriend?.id]);
  //     console.log('Cached pastHelloes:', cachedHelloes);

  //     // Log the cached data for 'inPersonHelloes'
  //     const cachedInPersonHelloes = queryClient.getQueryData(['inPersonHelloes', selectedFriend?.id]);
  //     console.log('Cached inPersonHelloes:', cachedInPersonHelloes);
  // }, [helloesList, selectedFriend, queryClient]);

  const flattenHelloes = useMemo(() => {
    if (helloesList) {
      return helloesList.flatMap((hello) => {
        const pastCapsules = hello.pastCapsules || [];
        return pastCapsules.length > 0
          ? pastCapsules.map((capsule) => ({
              id: hello.id,
              date: hello.date,
              type: hello.type,
              typedLocation: hello.typedLocation,
              locationName: hello.locationName,
              location: hello.location,
              additionalNotes: hello.additionalNotes || "", // Keep existing additional notes
              capsuleId: capsule.id,
              capsule: capsule.capsule,
              typedCategory: capsule.typed_category,
            }))
          : [
              {
                id: hello.id,
                date: hello.date,
                type: hello.type,
                typedLocation: hello.typedLocation,
                locationName: hello.locationName,
                location: hello.location,
                additionalNotes: hello.additionalNotes || "", // Keep existing additional notes
                capsuleId: null,
                capsule: null,
                typedCategory: null,
              },
            ];
      });
    }
  }, [helloesList]);

  const createHelloMutation = useMutation({
    mutationFn: (data) => saveHello(data),
    onError: (error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["pastHelloes"], (old) => {
        const updatedHelloes = old ? [data, ...old] : [data];
        return updatedHelloes;
      });

      const actualHelloesList = queryClient.getQueryData(["pastHelloes"]);
      //console.log("Actual HelloesList after mutation:", actualHelloesList);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        createHelloMutation.reset();
      }, 2000);
    },
  });

  const handleCreateHello = async (helloData) => {
    const hello = {
      user: user.id,
      friend: helloData.friend,
      type: helloData.type,
      typed_location: helloData.manualLocation,
      additional_notes: helloData.notes,
      location: helloData.locationId,
      date: helloData.date,
      thought_capsules_shared: helloData.momentsShared,
      delete_all_unshared_capsules: helloData.deleteMoments, // ? true : false,
    };

    //console.log("Payload before sending:", hello);

    try {
      await createHelloMutation.mutateAsync(hello); // Call the mutation with the location data
    } catch (error) {
      console.error("Error saving hello:", error);
    }
  };

  const handleDeleteHelloRQuery = async (data) => {
    try {
      await deleteHelloMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHelloMutation = useMutation({
    mutationFn: (data) => deleteHelloAPI(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["pastHelloes", selectedFriend?.id], (old) => {
        return old ? old.filter((hello) => hello.id !== data.id) : [];
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        deleteHelloMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      setResultMessage("Oh no! :( Please try again");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to reset the state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        deleteMomentMutation.reset();
      }, 2000);
    },
  });

  const helloesListMonthYear = useMemo(() => {
    if (helloesList) {
      if (!Array.isArray(helloesList)) {
        console.error(
          "Invalid data passed to groupByMonthAndYear:",
          helloesList
        );
        return [];
      }

      const groupedData = helloesList.reduce((acc, item) => {
        const createdDate = new Date(item.dateLong + "T00:00:00");

        if (isNaN(createdDate)) {
          console.error("Invalid date:", item.dateLong);
          return acc;
        }

        const monthYear = `${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

        if (!acc[monthYear]) {
          acc[monthYear] = {
            data: [],
            days: [],
          };
        }

        acc[monthYear].data.push(item);

        const dayOfMonth = createdDate.getDate();
        if (!acc[monthYear].days.includes(dayOfMonth)) {
          acc[monthYear].days.push(dayOfMonth);
        }

        return acc;
      }, {});

      const allDates = helloesList.map(
        (item) => new Date(item.dateLong + "T00:00:00")
      );
      const minDate = new Date(Math.min(...allDates));
      const maxDate = new Date(Math.max(...allDates));

      const monthsList = [];
      const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

      while (start <= end) {
        const monthYear = `${start.getMonth() + 1}/${start.getFullYear()}`;
        monthsList.push(monthYear);
        start.setMonth(start.getMonth() + 1);
      }

      const sortedMonths = monthsList.map((monthYear, index) => {
        return {
          monthYear,
          index,
          data: groupedData[monthYear]?.data || [],
          days: groupedData[monthYear]?.days || [],
        };
      });

      return sortedMonths;
    }
    return [];
  }, [helloesList]);

  //for some dumb reason i don't record the dates of the helloes thenmselves like a normal person
  //on my backend so here is my modified function to format it
  const lightFormatBackendDateToMonthYear = (backendDate) => {
    const date = new Date(backendDate);
    const month = date.getUTCMonth() + 1; // Get UTC month
    const year = date.getUTCFullYear(); // Get UTC year
    //console.log('LATEST DATE IN CALCULATOR:', year, month);
    return `${month}/${year}`;
  };

  const latestHelloDate = useMemo(() => {
    if (helloesList) {
      const latestDate = lightFormatBackendDateToMonthYear(
        helloesList[0].dateLong
      );
      return latestDate;
    }
  }, [helloesList]);

  const earliestHelloDate = useMemo(() => {
    if (helloesList) {
      const earliestDate = lightFormatBackendDateToMonthYear(
        helloesList[helloesList.length - 1].dateLong
      );
      return earliestDate;
    }
  }, [helloesList]);

  const monthsInRange = useMemo(() => {
    if (helloesList) {
      const earliestDate = lightFormatBackendDateToMonthYear(
        helloesList[helloesList.length - 1].dateLong
      );
      const latestDate = lightFormatBackendDateToMonthYear(
        helloesList[0].dateLong
      );

      const [startMonthNum, startYear] = earliestDate.split("/").map(Number);
      const [endMonthNum, endYear] = latestDate.split("/").map(Number);

      // Set the start and end dates based on the given months
      const startDate = new Date(startYear, startMonthNum - 1, 1); // Start of the given start month
      const endDate = new Date(endYear, endMonthNum - 1, 1); // Start of the given end month
      //console.log("END DATE", endDate);
      // Generate all months in the interval
      const months = eachMonthOfInterval({
        start: startDate,
        end: endDate,
      }).map((date) => {
        return {
          month: format(date, "MMMM"), // Full month name
          year: format(date, "yyyy"), // Year
          daysInMonth: getDaysInMonth(date), // Total days in the month
          startsOn: format(startOfMonth(date), "EEEE"), // Day of the week the month starts on
          monthYear: format(date, "M/yyyy"), // Month/Year in M/yyyy format
        };
      });

      return months;
    }
  }, [helloesList]);

  return (
    <HelloesContext.Provider
      value={{
        helloesList,
        isFetching,
        flattenHelloes,
        //inPersonHelloes,
        helloesIsFetching,
        helloesIsLoading,
        helloesIsSuccess,
        helloesIsError,
        createHelloMutation,
        handleCreateHello,
        getCachedInPersonHelloes,
        helloesListMonthYear,
        latestHelloDate,
        earliestHelloDate,
        monthsInRange,
        handleDeleteHelloRQuery,
        deleteHelloMutation,
      }}
    >
      {children}
    </HelloesContext.Provider>
  );
};
