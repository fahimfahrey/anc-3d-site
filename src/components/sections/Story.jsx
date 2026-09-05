import { Panel, Kicker, Facts, Metric } from '../Panel'

/* Chapters 1–9. Each one sits opposite whatever the 3D stage is showing,
   so the copy never lands on top of the hardware it describes. */
export function Story() {
  return (
    <>
      <Panel id="case" index={1} side="left">
        <Kicker n={1}>The case</Kicker>
        <h2 className="display display--lg">
          The case is
          <br />
          the other half
        </h2>
        <p className="copy">
          Drop the buds into the tray and they charge on contact. Ten minutes on Type-C gives you
          another hundred minutes of playback, which is most of the way home.
        </p>
        <Facts
          items={[
            ['Port', 'USB Type-C'],
            ['Fast charge', '10 min → 100 min'],
            ['Status', 'Front light bar'],
          ]}
        />
      </Panel>

      <Panel id="battery" index={2} side="left">
        <Kicker n={2}>Runtime</Kicker>
        <Metric n="80" unit="hours" />
        <h2 className="display display--lg">A week between charges</h2>
        <p className="copy">
          Seven to eight hours from the buds on their own, and the case carries the rest. For most
          people that is a full week of commutes before a cable comes out.
        </p>
        <Facts
          items={[
            ['Buds alone', '7–8 hours'],
            ['With case', '80 hours'],
            ['Recharge', '10 min = 100 min'],
          ]}
        />
      </Panel>

      <Panel id="anc" index={3} side="left">
        <Kicker n={3}>Noise cancellation</Kicker>
        <Metric n="45" unit="dB" />
        <h2 className="display display--lg">Turn the room off</h2>
        <p className="copy">
          Mics on the outside and inside of each bud read what is around you and play back its
          opposite. Engines, fans and open-plan noise drop away. What you were listening to does not.
        </p>
        <Facts
          items={[
            ['Depth', 'Up to 45dB'],
            ['Modes', 'ANC · Transparency · Off'],
            ['Seal', 'Three tip sizes'],
          ]}
        />
      </Panel>

      <Panel id="bass" index={4} side="left">
        <Kicker n={4}>Drivers</Kicker>
        <h2 className="display display--lg">
          13mm across,
          <br />
          moving in pairs
        </h2>
        <p className="copy">
          Each bud runs a 13mm dual dynamic driver. ICE Signature Turbo Bass is how it ships; three
          EQ profiles sit behind it in the app if you want the low end pulled back.
        </p>
        <Facts
          items={[
            ['Driver', '13mm dual dynamic'],
            ['Codecs', 'SBC, AAC'],
            ['EQ', '3 profiles'],
          ]}
        />
      </Panel>

      <Panel id="water" index={5} side="left">
        <Kicker n={5}>Water resistance</Kicker>
        <Metric n="IPX5" unit="" />
        <h2 className="display display--lg">Rain, sweat, a spilled bottle</h2>
        <p className="copy">
          IPX5 covers a jet of water from any direction. Finish the set, get caught in the rain, keep
          walking. The buds are rated for it; the case is not, so keep that dry.
        </p>
      </Panel>

      <Panel id="app" index={6} side="left">
        <Kicker n={6}>Original Sound</Kicker>
        <h2 className="display display--lg">Retune them from your phone</h2>
        <p className="copy">
          Original Sound handles EQ, the noise modes, gaming mode, firmware and what each touch on the
          stem does. Free on Google Play and the App Store.
        </p>
        <Facts
          items={[
            ['App', 'Original Sound'],
            ['Controls', 'Touch mapping, EQ'],
            ['Updates', 'Over the air'],
          ]}
        />
      </Panel>

      <Panel id="dual" index={7} side="left">
        <Kicker n={7}>Multipoint</Kicker>
        <h2 className="display display--lg">Two devices, no re-pairing</h2>
        <p className="copy">
          Hold a link to your laptop and your phone at the same time. A call arrives, the buds move
          across, and the laptop picks up where it left off when you hang up.
        </p>
      </Panel>

      <Panel id="mics" index={8} side="right">
        <Kicker n={8}>Call clarity</Kicker>
        <Metric n="4" unit="mics" />
        <h2 className="display display--lg">So the other side hears you</h2>
        <p className="copy">
          ENC runs across a four-microphone array. It holds on to the shape of your voice and throws
          away the traffic behind it, which is the difference between a call outdoors working and not.
        </p>
      </Panel>

      <Panel id="gaming" index={9} side="left">
        <Kicker n={9}>Gaming mode</Kicker>
        <Metric n="45" unit="ms" />
        <h2 className="display display--lg">Sound lands with the frame</h2>
        <p className="copy">
          Switch on gaming mode and latency drops to 45ms. Footsteps, reloads and hit markers arrive
          when the picture does instead of trailing it.
        </p>
      </Panel>
    </>
  )
}
