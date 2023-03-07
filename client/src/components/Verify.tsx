import React from "react";

const Verify = ({ onCheck }: { onCheck: () => void }) => {
  return (
    <div className="m-auto w-full pb-10 md:w-6/12 lg:w-10/12 xl:w-10/12">
      <p className="text-center text-2xl md:text-4xl my-10">
        Simple Zk Identity
      </p>
      <div className="w-full flex flex-col xl:flex-row">
        <div className="w-full mx-auto xl:w-4/12">
          <img
            src={"/starwars.png"}
            alt="logo"
            style={{
              objectFit: "cover",
            }}
            className="mx-auto max-w-xs rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-center xl:w-8/12">
          <p className="text-center font-bold text-2xl my-4">
            Star Wars: A New Hope
          </p>
          <p className="text-sm text-left font-light w-11/12 sm:w-full mx-auto">
            An epic space adventure film about a young farmer named Luke
            Skywalker who discovers his destiny as a Jedi Knight, a legendary
            warrior who can harness the power of the Force. Together with his
            new allies, the dashing smuggler Han Solo and the wise Jedi Master
            Obi-Wan Kenobi, Luke must rescue Princess Leia from the clutches of
            the evil Empire and stop the sinister Darth Vader from crushing the
            rebellion. With thrilling action, dazzling special effects, and
            unforgettable characters, "Star Wars" is a classic sci-fi
            masterpiece that will transport you to a galaxy far, far away.
          </p>
          <div className="flex flex-row gap-5 mt-5 ml-2 justify-center">
            <img src="/p18.png" alt=".." className="my-auto w-20" />
            <img src="/adultcontent.png" alt=".." className="my-auto w-20" />
          </div>
          <p className="text-center my-5 font-light text-gray-400 text-sm w-11/12 mx-auto">
            In order to proceed, you are required to prove that you are at least
            18 years old by clicking the button below.
          </p>
          <button
            className="text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-full text-sm px-5 py-2.5 text-center  w-60 h-max mx-auto"
            onClick={onCheck}
          >
            Prove My Age
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
