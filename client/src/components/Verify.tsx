import React from "react";

const Verify = ({ onCheck }: { onCheck: () => void }) => {
  return (
    <div className="m-auto w-full pb-10 sm:w-6/12">
      <p className="text-center text-2xl md:text-4xl my-10">
        Simple Zk Identity
      </p>
      <div className="w-full flex flex-col sm:flex-row">
        <div className="w-full mx-auto sm:w-4/12">
          <img
            src="https://cdn.discordapp.com/attachments/975016607233495042/1082350460524048414/0_org_zoom.png"
            alt="logo"
            style={{
              objectFit: "cover",
            }}
            className="mx-auto max-w-xs rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-center sm:w-8/12">
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
            <img
              src="https://cdn.discordapp.com/attachments/975016607233495042/1082352449878245427/x.png"
              alt=".."
              className="my-auto w-20"
            />
            <img
              src="https://cdn.discordapp.com/attachments/975016607233495042/1082352450188607619/y.png"
              alt=".."
              className="my-auto w-20"
            />
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

/**
 *   <div className="m-auto w-full md:w-6/12">
      <p className="text-center text-4xl relative bottom-10">
        Simple Zk Identity
      </p>
      <div className="w-full h-full flex flex-col">
        <div className="w-full p-10 md:p-0 mx-auto">
          <img
            src="https://cdn.discordapp.com/attachments/975016607233495042/1082350460524048414/0_org_zoom.png"
            alt="logo"
            style={{
              objectFit: "cover",
            }}
            className="mx-auto max-w-xs"
          />
        </div>
        <div className="w-7/12 pt-10 flex flex-col justify-center  md:pb-24">
          <p className="text-center font-bold text-2xl">
            Star Wars: A New Hope
          </p>
          <p className="text-md mt-2 text-left mx-2 font-light mb-10">
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
            <img
              src="https://cdn.discordapp.com/attachments/975016607233495042/1082352449878245427/x.png"
              alt=".."
              className="my-auto w-20"
            />
            <img
              src="https://cdn.discordapp.com/attachments/975016607233495042/1082352450188607619/y.png"
              alt=".."
              className="my-auto w-20"
            />
          </div>
          <p className="text-center my-5 font-light text-gray-400 text-sm">
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
 */
