import Layout from "../components/layout";
import {
  container,
  page,
  pageHeader,
  section,
  sectionHeader,
  sectionItem,
} from "../components/layout.module.css";

const Terms = () => (
  <Layout title="Terms">
    <div className={`${container} ${page}`} style={{ fontSize: "0.75rem" }}>
      <div className={pageHeader}>Terms</div>
      <div className={section}>
        <div className={sectionHeader}>Copyright &amp; Intellectual Property Policy</div>
        <p>
          trace.moe respects the intellectual property rights of others and expects its users to do
          the same. <br />
          It is our policy, in appropriate circumstances and at its discretion, to disable and/or
          terminate the accounts of users who repeatedly infringe the copyrights or other
          intellectual property rights of others.
        </p>
        <p>
          In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be
          found on the U.S. Copyright Office website at{" "}
          <a href="http://www.copyright.gov/legislation/dmca.pdf">
            http://www.copyright.gov/legislation/dmca.pdf
          </a>
          , we will respond expeditiously to claims of copyright infringement committed using the
          website, mobile device application and related services (collectively, the "Services")
          that are reported to our Designated Copyright Agent, identified in the sample notice
          below.
        </p>
        <p>
          If you are a copyright owner, or are authorized to act on behalf of one, or authorized to
          act under any exclusive right under copyright, please report alleged copyright
          infringements taking place on or through the Services by completing the following DMCA
          Notice of Alleged Infringement and delivering it to our Designated Copyright Agent. Upon
          receipt of the Notice as described below, we will take whatever action, in its sole
          discretion, it deems appropriate, including removal of the challenged material from the
          Services.
        </p>
      </div>

      <div className={section}>
        <div className={sectionHeader}>DMCA Notice of Alleged Infringement ("Notice")</div>
        <ol>
          <li>
            <p>
              Identify the copyrighted work that you claim has been infringed, or - if multiple
              copyrighted works are covered by this Notice - you may provide a representative list
              of the copyrighted works that you claim have been infringed.
            </p>
          </li>
          <li>
            <p>
              Identify the material that you claim is infringing (or to be the subject of infringing
              activity) and that is to be removed or access to which is to be disabled, and
              information reasonably sufficient to permit us to locate the material on the Services.
            </p>
          </li>
          <li>
            <p>Provide your mailing address, telephone number, and, if available, email address.</p>
          </li>
          <li>
            <p>Include both of the following statements in the body of the Notice:</p>
            <p>
              "I hereby state that I have a good faith belief that the disputed use of the
              copyrighted material is not authorized by the copyright owner, its agent, or the law
              (e.g., as a fair use)."
            </p>
            <p>
              "I hereby state that the information in this Notice is accurate and, under penalty of
              perjury, that I am the owner, or authorized to act on behalf of the owner, of the
              copyright or of an exclusive right under the copyright that is allegedly infringed."
            </p>
          </li>

          <li>Provide your full legal name and your electronic or physical signature.</li>
        </ol>
        <p>
          Deliver this Notice, with all items completed, to our contact at{" "}
          <a href="mailto:help@trace.moe">help@trace.moe</a>
        </p>
      </div>

      <div className={section}>
        <div className={sectionHeader}>Notification of Trademark Infringement:</div>
        <p>
          If you believe that your trademark (the "Mark") is being used on the Services by a user in
          a way that constitutes trademark infringement, please provide our Designated Copyright
          Agent (specified above) with the following information:
        </p>
        <ol>
          <li>
            <p>Your full legal name and your electronic or physical signature.</p>
          </li>
          <li>
            <p>
              Information reasonably sufficient to permit us to contact you or your authorized
              agent, including a name, mailing address, telephone number and, if available, an email
              address.
            </p>
          </li>
          <li>
            <p>
              Identification of the Mark(s) alleged to have been infringed, including (i) for
              registered Marks, a copy of each relevant federal trademark registration certificate
              or (ii) for common law or other Marks, evidence sufficient to establish your claimed
              rights in the Mark, including the nature of your use of the Mark, and the time period
              and geographic area in which the Mark has been used by you.
            </p>
          </li>
          <li>
            <p>
              Information reasonably sufficient to permit us to identify the use being challenged.
            </p>
          </li>
          <li>
            <p>Include both of the following statements in the body of the Notice:</p>
            <p>
              "I hereby state that I have not authorized the challenged use, and I have a good-
              faith belief that the challenged use is not authorized by law."
            </p>
            <p>
              "I hereby state under penalty of perjury that all of the information in the
              notification is accurate and that I am the owner of the Mark, or authorized to act on
              behalf of the owner of the Mark."
            </p>
          </li>
        </ol>
        <p>
          Upon receipt of notice as described above, we will seek to confirm the existence of the
          Mark on the Services, notify the registered user who posted the content including the
          Mark, and take whatever action, in our sole discretion, we deem appropriate, including
          temporary or permanent removal of the Mark from the Services.
        </p>
      </div>

      <a href="//www.iubenda.com/privacy-policy/7764846" title="Privacy Policy">
        Privacy Policy
      </a>
      <p>All images uploaded to search engine are deleted immediately.</p>
    </div>
  </Layout>
);
export default Terms;
